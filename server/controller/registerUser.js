const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel")

async function registerUser(req,res){
    try {
        const {name,email,password,confirmPassword,profile_pic} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:"Passwords don't match"});
        }

        const checkEmail = await UserModel.findOne({email});

        if(checkEmail){
            return res.status(400).json({error:"User already exists"});
        }

        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = {
            name,
            email,
            profile_pic,
            password : hashPassword
        }

        const user = new UserModel(newUser)
        const userSave = await user.save();

        return res.status(201).json({
            message:"User created successfully",
            data: userSave,
            success: true,
        })
        
    } catch (error) {
        console.log("Error in registerUser Controller:",error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = registerUser;