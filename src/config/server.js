const express = require('express');
const cors = require('cors');

/**
 * Creates and configures the Express application instance.
 * Shared middleware (CORS, JSON body parsing, etc.) is registered here.
 *
 * @returns {import('express').Express} Configured Express app.
 */
const initServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    return app;
};

module.exports = initServer;