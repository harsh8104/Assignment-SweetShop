const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
