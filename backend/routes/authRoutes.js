const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const { auth, adminOnly } = require("../middleware/authMiddleware");

// Login route
router.post("/login", login);

// Register user — only Admin can add users
router.post("/register", auth, adminOnly, register);

module.exports = router;
