const bcryptjs = require("bcryptjs");
const UserModel = require("../models/UserModel");

async function forgotPassword(req, res) {
    try {
        const { password, userId } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                message: "Missing userId or password",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Password reset successful",
            success: true
        });

    } catch (error) {
        console.error("Error in forgotPassword controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = forgotPassword;
