/**
 * Users Controller (Admin-only)
 *
 * getStaffUsers     — GET  /api/users/staff       — list all staff accounts
 * createStaffUser   — POST /api/users/staff        — create a new staff account
 * changePassword    — PATCH /api/users/:id/password — change any user's password
 * deleteUser        — DELETE /api/users/:id         — remove a user
 */

const User = require("../models/user");

// ── List all staff accounts ───────────────────────────────────────────────────
const getStaffUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "staff" }).select("-passwordHash").sort({ branch: 1 });
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Create a new staff account ────────────────────────────────────────────────
// Body: { branch, password, displayName? }
const createStaffUser = async (req, res) => {
  try {
    const { branch, password, displayName } = req.body;

    if (!branch || !password) {
      return res.status(400).json({ success: false, message: "branch and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    // One staff account per branch — enforce uniqueness
    const existing = await User.findOne({ role: "staff", branch: branch.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A staff account for '${branch}' already exists.`,
      });
    }

    // Generate a unique username from the branch slug
    const username = `staff_${branch.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`;

    const user = new User({
      username,
      displayName: displayName || `Staff – ${branch}`,
      role: "staff",
      branch: branch.trim(),
    });
    user.password = password; // triggers pre-save bcrypt hook
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Staff account created.",
      data: { id: user._id, username: user.username, branch: user.branch, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Change a user's password (owner / manager can change staff; owner can change all) ──
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Only owner can change other owner/manager passwords
    if (user.role !== "staff" && req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can change admin or manager passwords.",
      });
    }

    user.password = newPassword; // triggers pre-save bcrypt hook
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete a user ─────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, message: "User deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStaffUsers, createStaffUser, changePassword, deleteUser };
