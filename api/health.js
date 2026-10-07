import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import connectDB from "../server/configs/db.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// GET /api/health
app.get('/', async (req, res) => {
    try {
        const connection = await connectDB();
        const dbStatus = mongoose.connection.readyState;
        const dbConnected = !!connection && dbStatus === 1;

        const dbStatusText = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        res.status(dbConnected ? 200 : 503).json({
            status: dbConnected ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            database: {
                status: dbStatusText[dbStatus] || 'unknown',
                readyState: dbStatus,
                connected: dbConnected
            },
            environment: process.env.NODE_ENV || 'development',
            vercel: !!process.env.VERCEL,
            mongodb_uri_set: !!process.env.MONGODB_URI,
            imagekit_configured: !!(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY),
            gemini_configured: !!process.env.GEMINI_API_KEY
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            mongodb_uri_set: !!process.env.MONGODB_URI
        });
    }
});

export default app;
