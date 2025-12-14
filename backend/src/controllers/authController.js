const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Fallback secret for test environments to avoid undefined JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL || "admin@sweetshop.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "admin@123";
const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || "Super Admin";

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

const demoteNonSuperAdmins = async () => {
  await User.updateMany(
    { email: { $ne: SUPER_ADMIN_EMAIL }, isAdmin: true },
    { isAdmin: false }
  );
};

const ensureSuperAdminAccount = async () => {
  await demoteNonSuperAdmins();

  let superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

  if (!superAdmin) {
    superAdmin = await User.create({
      username: SUPER_ADMIN_USERNAME,
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      isAdmin: true,
    });
    return superAdmin;
  }

  let shouldSave = false;

  if (!superAdmin.isAdmin) {
    superAdmin.isAdmin = true;
    shouldSave = true;
  }

  const passwordMatches = await superAdmin.matchPassword(SUPER_ADMIN_PASSWORD);

  if (!passwordMatches) {
    superAdmin.password = SUPER_ADMIN_PASSWORD;
    shouldSave = true;
  }

  if (shouldSave) {
    await superAdmin.save();
  }

  return superAdmin;
};

const respondWithUser = (user, res) => {
  return res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        message:
          "Super admin account is managed by the system. Use admin login.",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: Boolean(isAdmin),
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        message: "Use the admin login page for super admin access.",
      });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Authenticate super admin and get token
 * @route POST /api/auth/admin-login
 * @access Public (credential-gated)
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const superAdmin = await ensureSuperAdminAccount();
    return respondWithUser(superAdmin, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
};
