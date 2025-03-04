const express = require("express");
const { registerUser, getUserById } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/:id", getUserById);

module.exports = router;
