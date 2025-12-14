const logger = require('./logger');
const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
};
module.exports = errorHandler;
// src/app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const initServer = require('./config/server');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./utils/errorHandler');
const app = initServer();
connectDB();
app.use('/api/users', userRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));