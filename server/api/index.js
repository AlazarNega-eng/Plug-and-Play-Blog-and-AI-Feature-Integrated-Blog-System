import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import connectDB from "../configs/db.js";    
import adminRouter from "../routes/adminRoutes.js";
import blogRouter from "../routes/blogRoutes.js";
import dbCheck from "../middleware/dbCheck.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: "Blog API is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// Handle favicon requests to prevent 500 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response
});

const healthCheck = async (req, res) => {
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
};

app.get(['/health', '/api/health'], healthCheck);

// Ensure DB connection for all API routes
app.use('/api', dbCheck);

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Export for Vercel
export default app;
