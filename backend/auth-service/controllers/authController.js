const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user);
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

// Verify JWT Token
exports.verifyToken = async (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: verified });
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};
