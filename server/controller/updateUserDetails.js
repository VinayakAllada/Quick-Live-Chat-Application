const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

async function updateUserDetails(req, res) {
    try {
        const token = req.cookies.token || "";

        const user = await getUserDetailsFromToken(token);

        const { name, password, profile_pic } = req.body;

        const updateData = { name, profile_pic };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            updateData.password = hashPassword;
        }

        await UserModel.updateOne(
            { _id: user._id },
            { $set: updateData }
        );

        const userInformation = await UserModel.findById(user._id).select("-password");

        return res.status(200).json({
            message: "User updated successfully",
            data: userInformation,
            success: true
        });

    } catch (error) {
        console.log("Error in updateUserDetails controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = updateUserDetails;
