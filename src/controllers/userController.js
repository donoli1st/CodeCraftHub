const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userService = require('../services/userService');


// Register a new user
async function registerUser(req, res, next) {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            const error = new Error('Username, email and password are required.');
            error.statusCode = 400;
            error.isOperational = true;
            throw error;
        }

        if (password.length < 6) {
            const error = new Error('Password must be at least 6 characters long.');
            error.statusCode = 400;
            error.isOperational = true;
            throw error;
        }

        const emailTaken = await userService.isEmailTaken(email);
        const usernameTaken = await userService.isUsernameTaken(username);

        if (emailTaken || usernameTaken) {
            const error = new Error('Username or email already in use.');
            error.statusCode = 409;
            error.isOperational = true;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userService.createUser({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        return next(error);
    }
};

// Login user
async function loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            const error = new Error('Email and password are required.');
            error.statusCode = 400;
            error.isOperational = true;
            throw error;
        }

        const user = await userService.findUserByEmail(email);

        if (!user) {
            const error = new Error('Invalid credentials.');
            error.statusCode = 401;
            error.isOperational = true;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error('Invalid credentials.');
            error.statusCode = 401;
            error.isOperational = true;
            throw error;
        }

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};