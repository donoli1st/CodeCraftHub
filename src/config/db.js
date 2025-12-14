const mongoose = require('mongoose');
const config = require('./env');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Exits the Node.js process if the connection cannot be established.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;