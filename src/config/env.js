// Centralized environment configuration for the application.
// Loads variables from .env (if present) and validates required ones.
require('dotenv').config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'];

requiredVars.forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is required but not set`);
	}
});

// Normalized config object that other modules can use.
const config = {
	// Connection string for MongoDB (used by Mongoose).
	mongoUri: process.env.MONGO_URI,
	// Secret key used to sign and verify JWT tokens.
	jwtSecret: process.env.JWT_SECRET,
	// Port on which the HTTP server will listen.
	port: process.env.PORT || 5000,
};

module.exports = config;