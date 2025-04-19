import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelname:{
        type: String,
        requried: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        requrid: true
    },
    password: {
        type: String,
        required:true
    },
    logoUrl: {
        type: String,
        requrid: true
    },
    logoId: {
        type: String,
        requrid: true
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedChannels:[ {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }]

}, {timestamps: true});

const userModel = mongoose.model("User", userSchema)

export default userModel;