import mongoose from "mongoose";
import connectDB from "../configs/db.js";

const dbCheck = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('Database not connected, attempting to connect...');

            if (!process.env.MONGODB_URI) {
                return res.status(503).json({
                    success: false,
                    message: "Database configuration not available"
                });
            }

            // Reuse shared connector which caches the connection
            const conn = await connectDB();
            if (!conn || mongoose.connection.readyState !== 1) {
                return res.status(503).json({
                    success: false,
                    message: "Database connection not available. Please try again later."
                });
            }
        }
        
        next();
    } catch (error) {
        console.error('Database connection check failed:', error.message);
        return res.status(503).json({
            success: false,
            message: "Database connection not available. Please try again later."
        });
    }
};

export default dbCheck;
