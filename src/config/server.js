const express = require('express');
const cors = require('cors');

const initServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    return app;
};

module.exports = initServer;