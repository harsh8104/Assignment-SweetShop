const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Fallback secret for tests if JWT_SECRET is not provided
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || "admin@sweetshop.local";

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (req.user && req.user.isAdmin) {
        const isSuperAdmin = req.user.email === SUPER_ADMIN_EMAIL;
        if (!isSuperAdmin) {
          req.user.isAdmin = false;
          await req.user.save();
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * Middleware to check if user is admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
