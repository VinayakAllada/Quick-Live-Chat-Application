const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
       
        const connection = mongoose.connection
        connection.on("Connected",()=>{
            console.log("Connection to DB successful");
        });

        connection.on("error",(error)=>{
            console.log("Error trying to connect with MongoDB:",error);
        });

    } catch(error){
        console.log("Error in connectDB file: ",error.message);

    }
}

module.exports = connectDB;