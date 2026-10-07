import express from "express";
import cors from "cors";
import 'dotenv/config';
import Blog from "../../server/models/Blog.js";
import dbCheck from "../../server/middleware/dbCheck.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(dbCheck);

// GET /api/blog/all
app.get('/', async (req, res) => {
    try {
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
