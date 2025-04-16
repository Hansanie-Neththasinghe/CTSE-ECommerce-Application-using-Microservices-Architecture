
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());

// Service URLs
const SERVICES = {
    USER_SERVICE: process.env.USER_SERVICE_URL || "http://user-service:5001",
    AUTH_SERVICE: process.env.AUTH_SERVICE_URL || "http://auth-service:5002",
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
    // console.log("🔐 Verifying with secret:", process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log("🔑 Token verified:", decoded);
        console.log("🔑 Token verified:");


        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        return res.status(401).json({ error: "Invalid Token API Gateway Level", detail: err.message });
    }
};

// Test Token Route (Optional)
app.get("/test-token", (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ valid: true, decoded });
    } catch (e) {
      res.status(401).json({ valid: false, error: e.message });
    }
  });
  

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
app.use(
    "/auth/login",
    createProxyMiddleware({
      target: SERVICES.AUTH_SERVICE,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        console.log("🔁 Rewriting path (auth):", path);
        return "/auth/login"; // ✅ This ensures correct route
      },
      logLevel: "debug"
    })
  );
    
// app.use("/auth", createProxyMiddleware({ target: SERVICES.AUTH_SERVICE, changeOrigin: true }));
// app.use("/api/update/users", authenticateToken, createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));
app.use("/api/users/register", createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true}));

app.use("/api/users", authenticateToken, createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));

// app.use("/api/users/register", createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true,  pathRewrite: {
//     "^/api/users/register": "/api/register"
// }
// }));



// // This is the correct code to user-service- register funcionality

// app.use(
//     "/api/users/register",
//     createProxyMiddleware({
//       target: SERVICES.USER_SERVICE,
//       changeOrigin: true,
//       pathRewrite: (path, req) => {
//         console.log("🔁 Rewriting path:", path);
//         return "/api/register";
//       },
//       logLevel: "debug"
//     })
//   );
  
app.use(express.json());


// // Protected Routes (Require Authentication)

// app.use("/api/users", authenticateToken, createProxyMiddleware({ target: SERVICES.USER_SERVICE, changeOrigin: true }));

// app.use(
//     "/api/users",
//     authenticateToken,
//     createProxyMiddleware({
//       target: SERVICES.USER_SERVICE,
//       changeOrigin: true,
//       pathRewrite: (path, req) => {
//         console.log("🔁 Before Rewriting path (protected user):", path );
//         const rewrittenPath = ("/api"+ path)
//         console.log("🔁 Rewriting path (protected user):", path, "→", rewrittenPath);
//         return rewrittenPath;
//       },
//       logLevel: "debug"
//     })
//   );  





// // This is the correct code to user-service

// app.use(
//   "/api/users",
//   authenticateToken,
//   createProxyMiddleware({
//     target: SERVICES.USER_SERVICE,
//     changeOrigin: true,
//     pathRewrite: (path, req) => {
//       const originalPath = req.originalUrl;
//       const rewrittenPath = originalPath.replace(/^\/api\/users/, "/api");
//       console.log("🔁 Rewriting path (protected user):", originalPath, "→", rewrittenPath);
//       return rewrittenPath;
//     },
//         logLevel: "debug"
//   })
// );


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

app.use((req, res, next) => {
    console.log(`➡️ Forwarding ${req.method} ${req.originalUrl}`);
    next();
  });
  

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 API Gateway is Running with Authentication & Role-Based Access Control!");
});

// Start API Gateway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
