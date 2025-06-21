const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ""},
    verifyOtpExpires: {type: Date, default: 0},
    isVerified: {type: Boolean, default: false},
    resetPasswordOtp: {type: String, default: ""},
    resetPasswordOtpExpires: {type: Date, default: 0},
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
module.exports = userModel;