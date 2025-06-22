const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../model/userModel.js");
const transporter = require('../config/nodemailer.js');

//Register function
const Register = async (req, res) => {
    //Getting the user details from the request body
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    try {
        //Checking if user exists
        const existingUser = await userModel.findOne({ email });
        //If yes, cannot create new user
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        //Hashing the password, since user doesn't exist
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating new user
        //Note: The userModel is imported from the userModel.js file
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save(); //saving user to the database

        //Creating a JWT token for the user
        //The token will be used for authentication in the future
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        //Sending the response back to the client
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        // Welcome mail
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nThe Team\n\nSura will come after you if you don't like it!`,
            html: `<p>Hello <b>${name}</b>,</p><p>Thank you for registering with us! We're excited to have you on board.</p><p>Best regards,<br>The Team<br><br>Sura will come after you if you don't like it!</p>`
        }

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "User created successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        //returns any other error that might occur before or during the user creation
        res.status(500).json({ success: false, message: error.message });
    }
};

//Login function
const Login = async (req, res) => {
    //Getting the email and password from the request body
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }
    try {
        //Checking if user exists
        const user = await userModel.findOne({ email });
        //If not, cannot login
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }
        //If user exists, check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        //Creating a JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        //Sending the response back to the client
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(200).json({ success: true, message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        //returns any other error that might occur before or during the login
        res.status(500).json({ success: false, message: error.message });
    }
};

//Logout function
const Logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        //returns any error that might occur during logout
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Function to send OTP for email verification
const sendVerifyOtp = async (req, res) => {
    try {
        // Use userId from middleware if present, else from body (for flexibility)
        const userId = req.user?.id || req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const OTP = String(Math.floor(Math.random() * 900000 + 100000));
        user.verifyOtp = OTP;
        user.verifyOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: user.email,
            subject: "OTP Verification",
            text: `Your OTP is ${OTP}. It is valid for 10 minutes.`,
            html: `<p>Your OTP is <b>${OTP}</b>. It is valid for 10 minutes.</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Function to verify the OTP
const verifyEmail = async (req, res) => {
    // Use userId from middleware if present, else from body (for flexibility)
    const userId = req.user?.id || req.body.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Please provide userId and OTP" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        } else if (user.verifyOtpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.isVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpires = 0;

        await user.save();
        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const isAuthenticated = async (req, res) => {
    try {
        // Get userId from middleware or request body
        const userId = req.user?.id || req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            // User is authenticated if found in DB and verified
            return res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
            
        }
        return res.status(200).json({ success: false, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    Register,
    Login,
    Logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated
};