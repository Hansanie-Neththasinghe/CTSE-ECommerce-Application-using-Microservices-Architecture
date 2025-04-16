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


// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');
const User = require("../models/User");

// @desc Register a new user (Admin/Customer)
// @route POST /users/register
const registerUser = async (req, res) => {
    console.log("🔔 Register endpoint hit");
    try {
        const { username, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        if (!["admin", "customer"].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Use 'admin' or 'customer'" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, role });

        // await user.save();
        if(user){
            res.status(201).json({ data: user, message: "User registered successfully" });
        }else {
            res.status(400).json({ message: "Error registering user" });
          }

    } catch (error) {
        console.error("❌ Error in registerUser:", error.message);
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

// @desc Get all users
// @route GET /users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

// // @desc Update a user by ID
// // @route PUT /users/:id
// const updateUserById = async (req, res) => {
//     console.log("✏️ Update endpoint hit", req.params.id, req.body);
//     console.log("📝 PUT body received:", req.body);
//     try {
//         const { username, email, password, role } = req.body;
//         const updateData = { username, email, role };

//         if (password) {
//             updateData.password = await bcrypt.hash(password, 10);
//         }

//         const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
//             new: true,
//             runValidators: true,
//         });

//         if (!updatedUser) return res.status(404).json({ error: "User not found" });

//         res.json({ message: "User updated successfully", data: updatedUser });
//     } catch (error) {
//         console.error("❌ Error in updateUserById:", error.message);
//         res.status(500).json({ error: "Server error: " + error.message });
//     }
// };

const updateUserById = async (req, res) => {
    console.log("✏️ Update endpoint hit:", req.params.id);
    console.log("📝 PUT body received:", req.body);

    try {
        const { username, email, password, role } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        if (password && password.trim() !== "") {
            console.log("🔒 Hashing password...");
            try {
                updateData.password = await bcrypt.hash(password, 10);
                console.log("✅ Password hashed successfully");
            } catch (err) {
                console.error("❌ Error hashing password:", err.message);
                return res.status(500).json({ error: "Error hashing password" });
            }
        }

        console.log("🛠 Updating user in DB...");
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            console.log("❗ User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User updated:", updatedUser);
        res.json({ message: "User updated successfully", data: updatedUser });

    } catch (error) {
        console.error("❌ Error in updateUserById:", error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};


// @desc Delete a user by ID
// @route DELETE /users/:id
const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

module.exports = { registerUser, getUserById, getAllUsers, updateUserById, deleteUserById };

