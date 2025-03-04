const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/products", productRoutes);

module.exports = app;
