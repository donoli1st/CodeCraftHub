const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Routes related to user registration and authentication.

// POST /api/users/register - create a new user account.
router.post('/register', registerUser);

// POST /api/users/login - authenticate a user and return a JWT.
router.post('/login', loginUser);

module.exports = router;