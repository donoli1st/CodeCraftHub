const User = require('../models/userModel');

/**
 * Finds a user by their MongoDB ObjectId.
 *
 * @param {string} userId
 * @returns {Promise<import('../models/userModel')|null>}
 */
exports.findUserById = async (userId) => {
    return await User.findById(userId);
};

/**
 * Looks up a single user by email address.
 *
 * @param {string} email
 * @returns {Promise<import('../models/userModel')|null>}
 */
exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Checks whether a user already exists with the given email.
 *
 * @param {string} email
 * @returns {Promise<boolean>}
 */
exports.isEmailTaken = async (email) => {
    const existing = await User.findOne({ email });
    return !!existing;
};

/**
 * Checks whether a user already exists with the given username.
 *
 * @param {string} username
 * @returns {Promise<boolean>}
 */
exports.isUsernameTaken = async (username) => {
    const existing = await User.findOne({ username });
    return !!existing;
};

/**
 * Creates and persists a new user document.
 *
 * Password is expected to be already hashed by the caller.
 *
 * @param {{ username: string, email: string, password: string }} params
 * @returns {Promise<import('../models/userModel')>}
 */
exports.createUser = async ({ username, email, password }) => {
    const user = new User({ username, email, password });
    await user.save();
    return user;
};