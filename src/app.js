const express = require('express');
const connectDB = require('./config/db');
const initServer = require('./config/server');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./utils/errorHandler');
const config = require('./config/env');

const app = initServer();

(async () => {
	await connectDB();

	app.use('/api/users', userRoutes);
	app.use(errorHandler);

	app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
})();