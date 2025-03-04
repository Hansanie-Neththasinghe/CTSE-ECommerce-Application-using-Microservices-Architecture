// const express = require("express");
// const { createProxyMiddleware } = require("http-proxy-middleware");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Service URLs
// const SERVICES = {
//     USER_SERVICE: process.env.USER_SERVICE_URL || "http://localhost:5001",
//     AUTH_SERVICE: process.env.AUTH_SERVICE_URL || "http://localhost:5002",
//     PRODUCT_SERVICE: process.env.PRODUCT_SERVICE_URL || "http://localhost:5003",
//     ORDER_SERVICE: process.env.ORDER_SERVICE_URL || "http://localhost:5004"
// };

// // Logging Middleware (Optional)
// app.use((req, res, next) => {
//     console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
//     next();
// });

// // Proxy Requests to Microservices
// app.use("/api/users", createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));
// app.use("/api/auth", createProxyMiddleware({ target: SERVICES.AUTH_SERVICE, changeOrigin: true }));
// app.use("/api/products", createProxyMiddleware({ target: SERVICES.PRODUCT_SERVICE, changeOrigin: true }));
// app.use("/api/orders", createProxyMiddleware({ target: SERVICES.ORDER_SERVICE, changeOrigin: true }));

// // Default Route
// app.get("/", (req, res) => {
//     res.send("API Gateway is Running!");
// });

// // Start API Gateway
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));



const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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

// Middleware for Logging Requests (Optional)
app.use((req, res, next) => {
    console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
    next();
});

// Middleware for Authentication
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(403).json({ error: "Access Denied: No Token Provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};

// Middleware for Role-Based Access Control (RBAC)
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access Forbidden: Insufficient Permissions" });
        }
        next();
    };
};

// Open Routes (No Authentication Required)
app.use("/auth", createProxyMiddleware({ target: SERVICES.AUTH_SERVICE, changeOrigin: true }));
app.use("/api/users/register", createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));

// Protected Routes (Require Authentication)
app.use("/api/users", authenticateToken, createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));
app.use("/api/products", authenticateToken, createProxyMiddleware({ target: SERVICES.PRODUCT_SERVICE, changeOrigin: true }));
app.use("/api/orders", authenticateToken, createProxyMiddleware({ target: SERVICES.ORDER_SERVICE, changeOrigin: true }));

// Admin-Only Routes
app.use(
    "/api/admin/products",
    authenticateToken,
    authorizeRole(["admin"]),
    createProxyMiddleware({ target: SERVICES.PRODUCT_SERVICE, changeOrigin: true })
);

app.use(
    "/api/admin/orders",
    authenticateToken,
    authorizeRole(["admin"]),
    createProxyMiddleware({ target: SERVICES.ORDER_SERVICE, changeOrigin: true })
);

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 API Gateway is Running with Authentication & Role-Based Access Control!");
});

// Start API Gateway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
