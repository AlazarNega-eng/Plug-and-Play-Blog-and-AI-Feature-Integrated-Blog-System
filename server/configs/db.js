import mongoose from "mongoose";

// Cache connection across hot reloads/serverless invocations
let cached = global.__mongoose_conn__ || { conn: null, promise: null };
global.__mongoose_conn__ = cached;

function buildMongoUri(base) {
    if (!base) return '';
    // If URI already includes a path segment after host (i.e., has a DB name), return as is
    // Matches: mongodb://user:pass@host:port/dbname?... OR mongodb+srv://.../dbname?...
    const hasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?/#]+/i.test(base);
    if (hasDbName) return base;
    // If ends without db name, append '/quickblog'
    return base.endsWith('/') ? `${base}quickblog` : `${base}/quickblog`;
}

const connectDB = async () => {
    try {
        if (cached.conn) {
            return cached.conn;
        }

        const mongoUriBase = process.env.MONGODB_URI;
        if (!mongoUriBase) {
            console.error("MONGODB_URI environment variable is not set");
            return null;
        }

        const mongoUri = buildMongoUri(mongoUriBase);

        if (!cached.promise) {
            if (!global.__mongoose_events_registered__) {
                mongoose.connection.on('connected', () => console.log("Database connected"));
                mongoose.connection.on('error', (err) => console.error("Database connection error:", err));
                mongoose.connection.on('disconnected', () => console.log("Database disconnected"));
                global.__mongoose_events_registered__ = true;
            }

            cached.promise = mongoose.connect(mongoUri, {
                // Optimize for serverless
                maxPoolSize: 1,
                serverSelectionTimeoutMS: 8000,
                socketTimeoutMS: 45000,
                // Disable command buffering in serverless
                bufferCommands: false
            }).then((m) => m);
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.conn = null;
        cached.promise = null;
        console.error("Database connection failed:", error.message);
        return null;
    }
};

export default connectDB;
