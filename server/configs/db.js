import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return mongoose.connection;
        }

        // Handle connection events
        mongoose.connection.on('connected', () => console.log("Database connected"));
        mongoose.connection.on('error', (err) => console.error("Database connection error:", err));
        mongoose.connection.on('disconnected', () => console.log("Database disconnected"));

        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("MONGODB_URI environment variable is not set");
            return null;
        }

        const connection = await mongoose.connect(`${mongoUri}/quickblog`, {
            // Optimize for serverless
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0
        });

        console.log("Successfully connected to MongoDB");
        return connection;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        // Don't throw error to prevent function crash
        // The app should still work even if DB connection fails initially
        return null;
    }
}

export default connectDB;
