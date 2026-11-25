/**
 * MongoDB Database Connection Configuration for NutriRoute
 * Enables seamless connection with MongoDB Compass and MongoDB Atlas.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutriroute';

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`====================================================`);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        console.log(`🧭 Viewable in MongoDB Compass at: ${MONGODB_URI}`);
        console.log(`====================================================`);
        return conn;
    } catch (err) {
        console.warn(`⚠️ MongoDB Connection Notice: Could not connect to ${MONGODB_URI}`);
        console.warn(`👉 To view in MongoDB Compass:`);
        console.warn(`   1. Ensure MongoDB service is running (or provide a MongoDB Atlas cloud URI in .env)`);
        console.warn(`   2. In MongoDB Compass, connect using: ${MONGODB_URI}`);
        return null;
    }
};

module.exports = { connectMongoDB, MONGODB_URI };
