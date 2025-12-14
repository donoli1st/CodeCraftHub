const logger = require('./logger');

/**
 * Global Express error-handling middleware.
 *
 * Logs the full error and sends a safe JSON response to the client.
 * If `err.statusCode` and `err.isOperational` are set, those values
 * are respected to return more specific HTTP status codes and messages.
 */
const errorHandler = (err, req, res, next) => {
    logger.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.isOperational && err.message ? err.message : 'Something went wrong.';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;