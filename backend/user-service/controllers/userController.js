const User = require('../models/User');

// @desc Register a new user
// @route POST /register
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// @desc Get a user by ID
// @route GET /users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

module.exports = { registerUser, getUserById };
