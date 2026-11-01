import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('cluster1.6xcxoka.mongodb.net')) {
        if (process.env.npm_lifecycle_event === 'build') return null;
        return null;
    }

    if (process.env.npm_lifecycle_event === 'build') return null;

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { 
            bufferCommands: false,
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS: 2000,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        console.warn("MongoDB connection offline, continuing in mock offline mode:", (err as Error).message);
        return null;
    }

    return cached.conn;
}
