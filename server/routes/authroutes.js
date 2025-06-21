const express = require('express');
const { Register, Login, Logout, sendVerifyOtp, verifyEmail } = require('../controller/authController');
const userAuth = require('../middleware/userAuth');

const authRouter = express.Router();

authRouter.post('/signup', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.post('/verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);

module.exports = authRouter;