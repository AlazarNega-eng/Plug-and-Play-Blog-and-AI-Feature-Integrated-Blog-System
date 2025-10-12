import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "../../server/configs/db.js";
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

// POST /api/admin/login
app.post('/', async (req, res) => {
    try {
        // Check database connection
        if (!dbConnected) {
            return res.status(503).json({
                success: false,
                message: "Database connection not available. Please try again later."
            });
        }

        const { username, password } = req.body;

        // Simple admin authentication (you can make this more secure)
        if (username === 'admin' && password === 'admin123') {
            // Generate a simple token (in production, use proper JWT)
            const token = 'admin_token_' + Date.now();
            
            res.json({
                success: true,
                message: "Login successful",
                token: token
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

export default app;
