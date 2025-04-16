const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Additions
// const router = express.Router();
// const { updateUserById } = require("./controllers/userController");


// Middleware
app.use(cors());

app.use(express.json());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// ✅ Log every incoming request
app.use((req, res, next) => {
    console.log(`📥 Received request at path: ${req.method} ${req.originalUrl}`);
    next();
  });


// Routes
app.use('/user-service', userRoutes);
// router.put("/:id", updateUserById);


// ✅ Global error handler – MUST be after all routes and middleware
app.use((err, req, res, next) => {
  console.error("🔥 Express error handler caught:", err.message);
  res.status(400).json({ error: "Invalid request body" });
});

module.exports = app;
