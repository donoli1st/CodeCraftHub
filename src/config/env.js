require('dotenv').config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET'];

requiredVars.forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is required but not set`);
	}
});

const config = {
	mongoUri: process.env.MONGO_URI,
	jwtSecret: process.env.JWT_SECRET,
	port: process.env.PORT || 5000,
};

module.exports = config;