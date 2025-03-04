const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Service URLs
const SERVICES = {
    USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:5001",
    AUTH_SERVICE: process.env.AUTH_SERVICE_URL || "http://localhost:5002",
    PRODUCT_SERVICE: process.env.PRODUCT_SERVICE_URL || "http://localhost:5003",
    ORDER_SERVICE: process.env.ORDER_SERVICE_URL || "http://localhost:5004"
};

// Logging Middleware (Optional)
app.use((req, res, next) => {
    console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
    next();
});

// Proxy Requests to Microservices
app.use("/api/users", createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));
app.use("/api/auth", createProxyMiddleware({ target: SERVICES.AUTH_SERVICE, changeOrigin: true }));
app.use("/api/products", createProxyMiddleware({ target: SERVICES.PRODUCT_SERVICE, changeOrigin: true }));
app.use("/api/orders", createProxyMiddleware({ target: SERVICES.ORDER_SERVICE, changeOrigin: true }));

// Default Route
app.get("/", (req, res) => {
    res.send("API Gateway is Running!");
});

// Start API Gateway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
