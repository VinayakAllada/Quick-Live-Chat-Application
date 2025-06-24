const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

async function checkPassword(req,res){
    try {
        
        const {password, userId} = req.body;

        const user = await UserModel.findById(userId);
        const verifyPassword = await bcryptjs.compare(password,user.password);

        if(!verifyPassword){
            return res.status(400).json({
                message:"Please check password",
                error : "true"
            })
        }

        const tokenData = {
            id: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn : '100d'})

        const cookieOption = {
            http : true,
            secure : true
        }
   
        return res.cookie('token',token,cookieOption).status(200).json({
            message:"Login successful",
            token : token,
            success :true
        })

    } catch (error) {
        console.log("Error in checkPassword controller:",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

module.exports = checkPassword;