import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple routes
app.get('/', (req, res) => {
    res.json({ 
        message: "Blog API is running!",
        status: "healthy",
        timestamp: new Date().toISOString(),
        env_check: {
            mongodb_set: !!process.env.MONGODB_URI,
            jwt_set: !!process.env.JWT_SECRET
        }
    });
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Export for Vercel
export default app;
