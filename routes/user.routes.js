import express from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post("/signup", async(req, res) => {
    // Handle user signup logic here
    try{
      const hashPassword = await bcrypt.hash(req.body.password , 10);
      console.log("Body of Hash password :", hashPassword)
      const uploadImage = await cloudinary.uploader.upload(
        req.files.logoUrl.tempFilePath
    )
    console.log("Image 📸",uploadImage)

      const newUser = new User({
        _id: new mongoose.Types.ObjectId,
        email: req.body.email,
        password: hashPassword,
        channelname: req.body.channelname,
        phone: req.body.phone,
        logoUrl: uploadImage.secure_url,
        logoId: uploadImage.public_id
      })

      let user = await newUser.save();
       res.status(201).json({
         user
       })
    }catch(err){
      console.log("Error in signup", err)
      res.status(500).json({
        message: "Error in signup",
        error: err.message
      })
    }
})

router.post("/login", async(req, res) => {
    try {

        const  existingUser = await User.findOne({email: req.body.email})
         
        if(!existingUser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isvalid = await bcrypt.compare(
            req.body.password,
            existingUser.password
        )

        if(!isvalid){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({
            _id: existingUser._id,
            channelname: existingUser.channelname,
            email: existingUser.email,
            phone: existingUser.phone,
            logoId: existingUser.logoId,
        }, process.env.JWT_TOKEN , {expiresIn: "10d"});


        res.status(200).json({
            _id: existingUser._id,
            channelname: existingUser.channelname,
            email: existingUser.email,
            phone: existingUser.phone,
            logoId: existingUser.logoId,
            logoUrl: existingUser.logoUrl,
            token: token,
            subscribers: existingUser.subscribers,
            subscribedChannels: existingUser.subscribedChannels,
        })

    } catch (error) {
        console.log("Error in login", error)
        res.status(500).json({
            message: "Error in login",
            error: error.message
        })
        
    }
})

export default router;