import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title:{
        type: String,
        required: true,
        trim: true,
    },
    decription: {
        type: String,
        requird: true,
        trim: true
    },
    user_id: {
        typr: mongoose.Schrma.Types.ObjectId,
        ref: "User",
        required: true
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnailUrl:{
       type: String,
       required: true,
       trime: true,
    },
    thumbnailId: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
   
    likedBy:[{tyepe: mongoose.Schema.Types.ObjectId, ref: "User"}],
    dislikedBy:[{tyepe: mongoose.Schema.Types.ObjectId, ref: "User"}],
    viewsBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

}, {timestamps: true});

videoSchema.virtual("likes").get(function(){
    return this.likedBy.length;
})

videoSchema.virtual("dislikes").get(function(){
    return this.disLikedBy.length;
})

videoSchema.virtual("views").get(function(){
    return this.viewedBy.length;
})

videoSchema.virtual("toJSON", {
    virtuals: true
});


const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;