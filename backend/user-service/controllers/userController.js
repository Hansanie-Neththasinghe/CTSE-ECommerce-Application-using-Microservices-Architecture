// const User = require('../models/User');

// // @desc Register a new user
// // @route POST /register
// const registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const user = new User({ username, email, password });
//         await user.save();
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(500).json({ error: "Server error: " + error.message });
//     }
// };

// // @desc Get a user by ID
// // @route GET /users/:id
// const getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).json({ error: "User not found" });
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: "Server error: " + error.message });
//     }
// };

// module.exports = { registerUser, getUserById };


const bcrypt = require("bcrypt");
const User = require("../models/User");

// @desc Register a new user (Admin/Customer)
// @route POST /users/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!["admin", "customer"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Use 'admin' or 'customer'" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// @desc Get user details by ID
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

