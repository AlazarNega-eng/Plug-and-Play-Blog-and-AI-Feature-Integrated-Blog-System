import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./configs/db.js";    
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

// Database connection
await connectDB();

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