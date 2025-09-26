import express from "express";
import cors from "cors";

const app = express();

// Basic middleware only
app.use(cors());
app.use(express.json());

// Simple routes
app.get('/', (req, res) => {
    res.json({ 
        message: "Blog API is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
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
