const userModel = require('../model/userModel');

const getUserData = async (res, req) => {
    const userId = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                isVerified: user.isVerified,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getUserData
};