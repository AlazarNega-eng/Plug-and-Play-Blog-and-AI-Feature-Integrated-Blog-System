import mongoose from "mongoose";

const dbCheck = async (req, res, next) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('Database not connected, attempting to connect...');
            
            // Try to connect if not connected
            if (process.env.MONGODB_URI) {
                await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`, {
                    maxPoolSize: 1,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                });
            } else {
                return res.status(503).json({
                    success: false,
                    message: "Database configuration not available"
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
