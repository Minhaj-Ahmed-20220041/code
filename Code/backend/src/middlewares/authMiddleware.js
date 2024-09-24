require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authorized
const isAuthorized = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Not Authorized!",
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userInfo = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({
      error: "Not Authorized!",
    });
  }
};

// Middleware to check if the user has admin privileges
const isAdmin = (req, res, next) => {
  if (req.userInfo.role !== 'admin') {
    console.log(`Access denied: User ${req.userInfo.userId} is not an admin.`);
    return res.status(403).json({
      error: "Not Authorized!",
    });
  }
  next();
};

// Middleware to extract user info if a valid token is present
const getUserInfo = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userInfo = { userId: decoded.userId, role: decoded.role };
    }

    next();
  } catch (error) {
    console.error("Error during info extraction:", error.message);
    next();
  }
};

module.exports = { isAuthorized, isAdmin, getUserInfo };
