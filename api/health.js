import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "../server/configs/db.js";
import Blog from "../server/models/Blog.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize database connection
let dbConnected = false;
connectDB().then(() => {
    dbConnected = true;
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection error:', err);
    dbConnected = false;
});

// GET /api/health
app.get('/', async (req, res) => {
    try {
        let dbStatus = 0;
        try {
            dbStatus = Blog.db ? Blog.db.readyState : 0;
        } catch (error) {
            console.log('Database status check failed:', error.message);
        }

        const dbStatusText = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        res.json({
            status: "healthy",
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
        res.status(500).json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

export default app;
