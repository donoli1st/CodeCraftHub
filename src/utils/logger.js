const winston = require('winston');

// Shared Winston logger instance used across the application.
// Logs are written as JSON to the console and to error.log for errors.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console()
    ]
});

module.exports = logger;