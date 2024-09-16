const express = require('express');
const { signup, login, forgotPassword, resetPassword, otpVerification } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);
router.post('/verify-otp', otpVerification);

module.exports = router;
