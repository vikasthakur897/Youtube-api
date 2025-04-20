import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user.model.js';
import Video from '../models/video.model.js';
import cloudinary from '../config/cloudinary.js';
import { checkAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Upload Video

router.post('/upload', checkAuth, async(req, res) =>{
    try {
        const {
            title, 
            description,
            category,
            tags
        } = req.body;

        if(!req.files || !req.files.video || !req.files.thumbnail){
            return res.status(400).json({
                message: "Please upload video and thumbnail"
            })
        }

        const videoUpload = await cloudinary.uploader.upload(
            req.files.video.tempFilePath,{
                resource_type: "video",
                folder: "videos"
            }
        )

        const thumbanailUpload = await cloudinary.uploader.upload(
            req.files.thumbnail.tempFilePath,{
                folder: "thumbnails"
            }
        )

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId,
            title,
            description,
            user_id: req.user_id,
            videoUrl: videoUpload.secure_url,
            thumbnailUrl: thumbanailUpload.secure_url,
            thumbnailId: thumbanailUpload.public_id,
            category,
            tags: tags ? tags.split(",") : [],
        })

        await newVideo.save();

        res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo
        })

    } catch (error) {
        console.log("Error in uploading video", error)
        res.status(500).json({
            message: "Somthing went wrong in uploading video",
            error: error.message
        })
    }
})


// Update Video

router.put('/update/:videoId', checkAuth, async(req, res) => {
    try {
        const {title, description, category, tags} = req.body;

        const videoId = req.params.videoId;

        let video = await Video.findById(videoId);
        if(!video){
            return res.status(404).json({
                message: "Video not found"
            })
        }
        if(video.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                error: "You are not authorized to update this video"
            })
        }

        if(req.files && req.files.thumbnail){
            await cloudinary.uploader.destroy(video.thumbnailId);
            const thumbanailUpload = await cloudinary.uploader.upload(
                req.files.thumbnail.tempFilePath,{
                    folder: "thumbnail"
                }
            )
            video.thumbnailUrl = thumbanailUpload.secure_url;
            video.thumbnailId = thumbanailUpload.public_id;
        }

        video.title = title || video.title;
        video.description = description || video.description;
        video.category = category || video.category;
        video.tags = tags ? tags.split(",") : video.tags;

        await video.save();
        res.status(200).json({
            message: "Video updated successfully",
            video
        })
        
    } catch (error) {
        console.log("Error in updating video", error)
        res.status(500).json({
            message: "Somthing went wrong in updating video",
            error: error.message
        })
        
    }
})




export default router;