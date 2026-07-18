/**
 * Auth Controller
 *
 * login       — Admin/manager login: { username, password } → JWT
 * staffLogin  — Staff login: { branch, password } → short JWT (staff role)
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ── Helper: sign a JWT ────────────────────────────────────────────────────────
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── Admin / Manager login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    const token = signToken({ userId: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName || user.username,
          role: user.role,
          branch: user.branch || null,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Staff login (by branch + password) ───────────────────────────────────────
// Staff accounts have role='staff' and their branch stored in the user record.
// The frontend sends the full branch name + password.
const staffLogin = async (req, res) => {
  try {
    const { branch, password } = req.body;

    if (!branch || !password) {
      return res.status(400).json({
        success: false,
        message: "Branch and password are required.",
      });
    }

    // Find the staff user whose branch matches exactly
    const user = await User.findOne({ role: "staff", branch: branch.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No staff account found for this branch.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    const token = signToken({ userId: user._id, role: "staff", branch: user.branch });

    return res.status(200).json({
      success: true,
      message: "Staff login successful.",
      data: {
        token,
        user: {
          id: user._id,
          displayName: user.displayName || user.branch,
          role: "staff",
          branch: user.branch,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, staffLogin };
