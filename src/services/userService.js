const User = require('../models/userModel');

exports.findUserById = async (userId) => {
    return await User.findById(userId);
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

exports.isEmailTaken = async (email) => {
    const existing = await User.findOne({ email });
    return !!existing;
};

exports.isUsernameTaken = async (username) => {
    const existing = await User.findOne({ username });
    return !!existing;
};

exports.createUser = async ({ username, email, password }) => {
    const user = new User({ username, email, password });
    await user.save();
    return user;
};