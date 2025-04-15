const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ✅ Log every incoming request
app.use((req, res, next) => {
    console.log(`📥 Received request at path: ${req.method} ${req.originalUrl}`);
    next();
  });

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', userRoutes);

module.exports = app;
