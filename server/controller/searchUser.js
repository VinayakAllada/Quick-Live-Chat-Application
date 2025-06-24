const UserModel = require('../models/UserModel');

async function searchUser(req,res){
    try {
        const {search} = req.body;

        const query = new RegExp(search,"i","g");

        const user = await UserModel.find({
            "$or" : [
                {name : query},
                {email : query}
            ]
        }).select("-password")

        return res.json({
            message : 'all user',
            data : user,
            success : true
        })
        
    } catch (error) {
        console.log("Error in searchUser Controller:",error.message)
        return res.status(500).json({Error : "Internal Server Error"});
    }
}

module.exports = searchUser