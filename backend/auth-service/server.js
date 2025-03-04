require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 4000;

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Authentication Service is running on port ${PORT}`);
});
