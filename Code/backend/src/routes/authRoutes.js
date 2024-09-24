const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/customer/register', authController.customerRegister);
router.post('/login', authController.login);
router.post('/manager/register', authController.adminRegister);
router.post('/manager/login', authController.adminLogin);

router.post('/forget-password', authController.forgetPassword);
router.patch('/verify-forget-password', authController.verifyForgetPassword);
router.patch('/reset-password', authController.resetPassword);

module.exports = router;
