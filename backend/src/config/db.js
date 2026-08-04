import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        const conn = await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
            isConnected = false;
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
            isConnected = false;
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    if (!isConnected) return;

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('🔌 MongoDB disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
    }
};
