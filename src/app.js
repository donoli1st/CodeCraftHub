// Application entry point: initializes Express, connects to MongoDB and starts the HTTP server.
const express = require('express');
const connectDB = require('./config/db');
const initServer = require('./config/server');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./utils/errorHandler');
const config = require('./config/env');

const app = initServer();

// Immediately-invoked async function to ensure the database is connected
// before the server starts accepting incoming requests.
(async () => {
	await connectDB();

	// Mount user-related routes and global error handler.
	app.use('/api/users', userRoutes);
	app.use(errorHandler);

	app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
})();