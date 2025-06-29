const express = require('express');
const { Register, Login, Logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } = require('../controller/authController');
const userAuth = require('../middleware/userAuth');

const authRouter = express.Router();

authRouter.post('/signup', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.post('/verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);
authRouter.post('/isauthenticated', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

module.exports = authRouter;