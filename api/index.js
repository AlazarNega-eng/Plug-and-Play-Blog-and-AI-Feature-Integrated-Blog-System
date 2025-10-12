import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// GET /api/
app.get('/', (req, res) => {
    res.json({ 
        message: "Blog API is running!",
        status: "healthy",
        timestamp: new Date().toISOString(),
        endpoints: {
            health: "/api/health",
            blogs: "/api/blog/all",
            admin: "/api/admin/login"
        }
    });
});

export default app;