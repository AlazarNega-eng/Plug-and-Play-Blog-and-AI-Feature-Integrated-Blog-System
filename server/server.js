import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./configs/db.js";    
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import Blog from "./models/Blog.js";
import dbCheck from "./middleware/dbCheck.js";

const app = express();

// Initialize database connection (non-blocking for Vercel)
let dbConnected = false;
connectDB().then(() => {
    dbConnected = true;
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection error:', err);
    dbConnected = false;
});

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
})

// Handle favicon requests to prevent 500 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response
});

app.get('/health', async (req, res) => {
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
})

// Ensure DB connection for all API routes
app.use('/api', dbCheck)

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
}

export default app;