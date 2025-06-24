const UserModel = require("../models/UserModel");

async function checkEmail(req,res){
    try {
        const {email} = req.body;

        const checkEmail = await UserModel.findOne({email}).select("-password")

        if(!checkEmail){
            return res.status(404).json({error:"User not found"});
        }

        return res.status(200).json({
            message:"Email verified successfully!",
            data : checkEmail,
            success : true
        })
        
    } catch (error) {
        console.log("Error in checkEmail Controller:",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports = checkEmail;