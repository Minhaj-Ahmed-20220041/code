const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authWare = require('../middlewares/authMiddleware');

// Get the profile of the currently logged-in user

router.get('/me', authWare.isAuthorized, userController.getUserProfile);

// Get all users (Admin only)
router.get('/', authWare.isAuthorized, authWare.isAdmin, userController.getAllUsers);

// Get a specific user by ID
router.get('/:userId', authWare.isAuthorized, userController.getUser);

// Update a user's profile (Logged-in user)
router.put('/:userId', authWare.isAuthorized, userController.updateUserProfile);

// Delete a user (Admin only)
router.delete('/:userId', authWare.isAuthorized, authWare.isAdmin, userController.deleteUser);

// Make a user an admin (Admin only)
router.post('/:userId/makeAdmin', authWare.isAuthorized, authWare.isAdmin, userController.makeAdmin);

// Remove admin privileges from a user (Admin only)
router.post('/:userId/removeAdmin', authWare.isAuthorized, authWare.isAdmin, userController.removeAdmin);

router.put('/change/password', authWare.isAuthorized, userController.changePassword)

module.exports = router;
