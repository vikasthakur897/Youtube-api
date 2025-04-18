import mongoose from "mongoose";

export const ConnectDB = async()=>{

    try{
      await mongoose.connect(process.env.MONGO_URI);
        console.log("DB CONNECTED SUCCESSFULLY");
    }
    catch(err){
        console.log("ERROR WHILE CONNECTING TO DB",(err.message));
        throw new Error("Something went wrong",err);
    }
}