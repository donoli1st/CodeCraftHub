const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.isOperational && err.message ? err.message : 'Something went wrong.';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;