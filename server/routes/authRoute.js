/**
 * Auth Routes
 *
 * POST /api/auth/login        — Public. Returns JWT on valid credentials.
 * POST /api/auth/staff-login  — Public. Returns short-lived staff JWT.
 *
 * Both endpoints are rate-limited to prevent brute-force attacks.
 */

const express = require("express");
const router = express.Router();
const { login, staffLogin } = require("../controller/authController");
const rateLimit = require("express-rate-limit");

// ── Rate limiter: max 10 login attempts per 15 minutes per IP ─────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

router.post("/login",       loginLimiter, login);
router.post("/staff-login", loginLimiter, staffLogin);

module.exports = router;
