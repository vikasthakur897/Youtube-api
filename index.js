import express from 'express';
import dotenv from 'dotenv';
import { ConnectDB } from './config/db.config.js';


dotenv.config();


const app = express();
ConnectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);

    
})