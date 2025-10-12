import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "../../server/configs/db.js";
import Blog from "../../server/models/Blog.js";
import dbCheck from "../../server/middleware/dbCheck.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database connection
let dbConnected = false;
connectDB().then(() => {
    dbConnected = true;
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection error:', err);
    dbConnected = false;
});

// GET /api/blog/all
app.get('/', async (req, res) => {
    try {
        // Check database connection
        if (!dbConnected) {
            return res.status(503).json({
                success: false,
                message: "Database connection not available. Please try again later."
            });
        }

        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            blogs: blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
});

export default app;
