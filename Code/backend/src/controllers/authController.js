require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Verification = require('../models/verification');
const resetUtil = require('../utils/passwordResetUtil');
const emailUtil = require('../utils/emailUtil');
const transporter = require('../config/emailConfig');

exports.customerRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    if (!firstName) {
      return res.status(400).json({ error: 'Firstname is missing!' });
    }
    const nameRgx = /^[a-zA-Z]+$/;
    if (!nameRgx.test(firstName)) {
      return res.status(400).json({ error: 'Firstname is invalid!' });
    }
    if (!lastName) {
      return res.status(400).json({ error: 'Lastname is missing!' });
    }
    if (!nameRgx.test(lastName)) {
      return res.status(400).json({ error: 'Lastname is invalid!' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is missing!' });
    }
    const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegx.test(email)) {
      return res.status(400).json({ error: 'Email is invalid!' });
    }
    if (!username) {
      return res.status(400).json({ error: 'Username is missing!' });
    }
    const usernameRegx = /^[a-zA-Z][a-zA-Z0-9.-]{3,}$/;
    if (!(usernameRegx).test(username)) {
      return res.status(400).json({ error: 'Username is invalid!' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is missing!' });
    }
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (password.length < 6 || !passwordRegx.test(password)) {
      return res.status(400).json({
        error: 'Invalid Password! ' +
          'Password must contain at least one number, ' +
          'one uppercase and one lowercase letter, ' +
          'one special character(! @ # $ % ^ & *), ' +
          'and must be atleast 6 or more characters.'
      });
    }
    // const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already used!' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username already taken!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, username, password: hashedPassword, role: 'user' });
    res.status(201).json({ userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is missing!' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is missing!' });
    }
    const user = await User.findOne({ username, status: { $ne: 'deleted' } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_KEY_EXPIRY });
    res.status(200).json({ token, user: { id: user._id, name: user.firstName, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = await User.create({ firstName, lastName, email, username, password: hashedPassword, role: 'manager' });
    res.status(201).json({ userId: newManager._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const manager = await User.findOne({ username, role: 'manager' });
    if (!manager) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const isValidPassword = await bcrypt.compare(password, manager.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: manager._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_SECRET_KEY_EXPIRY });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const resetEmail = req.body.email;
    if (!resetEmail)
      return res.status(400).json({ error: 'Email is missing!' });
    const user = await User.findOne({ email: resetEmail });
    if (!user)
      return res.status(400).json({ error: 'No user found for the given Email!' });

    //invalidate previous unused reset codes
    const exisitngVerifications = await Verification.find({ email: resetEmail, isCodeConsumed: false, isTokenConsumed: false });
    if (exisitngVerifications.length >= 1) {
      for (const ver of exisitngVerifications) {
        ver.isCodeConsumed = true;
        ver.isTokenConsumed = true;
        ver.save();
      }
    }

    const verification = await Verification.create({
      userId: user._id,
      email: user.email,
      case: 'password_reset_verification',
      code: resetUtil.generateResetVerificationCode(Number(process.env.EMAIL_VERIFICATION_CODE_LENGTH)),
      codeExpiration: new Date(Date.now() + Number(process.env.EMAIL_VERIFICATION_CODE_EXPIRY_MS))
    });
    transporter.sendMail(emailUtil.resetVerificationEmail(user.username, resetEmail, verification.code), (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send verification email. Something went wrong. Please try again later.' });
      } else {
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ message: 'Verification email has been sent.' });
      }
    });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json('Internal server error: Email sending failed. Please try again later!');
  }
};

exports.verifyForgetPassword = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    if (!verificationCode)
      return res.status(400).json({ error: 'Verification code is missing!' });
    const verification = await Verification.findOne({ email: email, code: verificationCode });
    if (!verification)
      return res.status(401).json({ error: 'Invalid verificaiton code!' });
    if (verification.isCodeConsumed)
      return res.status(400).json({ error: 'The code has already been used!' });
    if (verification.codeExpiration < new Date())
      return res.status(400).json({ error: 'The code has expired!' });

    const token = resetUtil.generateUniqueToken();
    verification.isCodeConsumed = true;
    verification.token = token;
    verification.tokenExpiration = new Date(Date.now() + Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY_MS));
    await verification.save();
    res.status(200).json({ resetToken: token });
  } catch (error) {
    console.log("Code verification failed: " + error.message);
    return res.status(500).json({
      error: "Internal server error: Code verification failed. Please try again later!"
    });
  }
};

exports.resetPassword = async (req, res) => {
  console.log("reseting password...");
  const { resetToken, newPassword } = req.body;
  try {
    if (!newPassword)
      return res.status(400).json({ error: 'New Password is missing!' });
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegx.test(newPassword))
      return res.status(400).json({
        error: 'Invalid Password! ' +
          'Password must contain at least one number, ' +
          'one uppercase and one lowercase letter, ' +
          'one special character(! @ # $ % ^ & *), ' +
          'and must be atleast 6 or more characters.'
      });
    if (!resetToken)
      return res.status(401).json({ error: 'Reset token is required!' });

    const verification = await Verification.findOne({ token: resetToken });
    if (!verification)
      return res.status(401).json({ error: 'Not Authorized!' });
    if (verification.isTokenConsumed || verification.tokenExpiration < new Date())
      return res.status(401).json({ error: 'Reset session has expired!' });

    const relatedUser = await User.findOne({ _id: verification.userId });
    if (!relatedUser)
      return res.status(400).json({ error: 'User not found!' });
    relatedUser.password = await bcrypt.hash(newPassword, 10);
    relatedUser.save();

    verification.isTokenConsumed = true;
    verification.token = undefined;
    await verification.save();

    return res.status(200).json({
      message: 'Password reset successful!',
    });
  } catch (error) {
    console.log("Reset error: " + error.message);
    return res.status(500).json({
      error: "Internal server error: Password reset failed. Please try again later!"
    });
  }
};