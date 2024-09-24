const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        const user = await User.findOne({
            _id: userId,
            status: { $ne: 'deleted' }
        }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid user ID' });

        const user = await User.findOne({ _id: id, status: { $ne: 'deleted' } });
        if (!user)
            return res.status(404).json({ error: 'User not found!' });

        const userInfo = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            username: user.username,
            role: user.role,
            billingInfo: user.billingInfo || {},
            paymentInfo: user.paymentInfo || {},
        };

        return res.status(200).json(userInfo);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const currentuser = req.userInfo;
        const userId = req.params.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: 'Invalid user ID' });
        const { firstName, lastName, email, billingInfo, paymentInfo } = req.body;

        if (currentuser.userId === userId || currentuser.role === 'admin') {
            const updateFields = {};
            if (firstName != null) updateFields.firstName = firstName;
            if (lastName != null) updateFields.lastName = lastName;
            if (email != null) updateFields.email = email;
            if (billingInfo != null) updateFields.billingInfo = billingInfo;
            if (paymentInfo != null) updateFields.paymentInfo = paymentInfo;

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId, status: { $ne: 'deleted' } },
                updateFields,
                { new: true }
            );
            if (!updatedUser)
                return res.status(404).json({ error: "User not found" });

            const response = updatedUser.toObject();
            delete response.password;

            return res.status(200).json({ message: 'User profile updated successfully', response });
        }
        return res.status(401).json({ error: "Not authorized to perform the action" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const currentuser = req.userInfo.userId;
        const userList = await User.find({
            _id: { $ne: currentuser },
            username: { $ne: 'admin' },
            status: { $ne: 'deleted' }
        }).select('-password');

        return res.status(200).json(userList);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: 'Invalid user ID' });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status: "deleted" },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: 'User deleted successfully', user: updatedUser });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.makeAdmin = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid user ID' });

        const user = await User.findById(id);
        if (!user)
            return res.status(404).json({ error: 'User not found!' });

        user.role = 'admin';
        await user.save();

        return res.status(200).json({ message: 'User has been made an admin' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.removeAdmin = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid user ID' });

        const user = await User.findById(id);
        if (!user)
            return res.status(404).json({ error: 'User not found!' });

        user.role = 'user';
        await user.save();

        return res.status(200).json({ message: 'Admin privileges removed from the user' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Something went wrong! Please try again later.' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userInfo.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
        if (newPassword.length < 6 || !passwordRegx.test(newPassword)) {
            return res.status(400).json({
                error: 'New Password is Invalid! ' +
                    'Password must contain at least one number, ' +
                    'one uppercase and one lowercase letter, ' +
                    'one special character(! @ # $ % ^ & *), ' +
                    'and must be atleast 6 or more characters.'
            });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect old password' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};