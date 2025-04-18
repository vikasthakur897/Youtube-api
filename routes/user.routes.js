import express from 'express';

const router = express.Router();

router.post("/signup", (req, res) => {
    // Handle user signup logic here
    res.send("User signed up successfully");
    res.status(201).json({ message: "User signed up successfully" });
})

export default router;