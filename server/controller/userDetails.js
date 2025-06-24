const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
async function userDetails(req,res){
    try {
        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)
        
        return res.status(200).json({
            message: "User Details:",
            data: user
        });
        
    } catch (error) {
        console.log("Error in userDetails Controller:",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
module.exports = userDetails;