/**
 * Authentication Middleware
 *
 * authenticate  — verifies the JWT in the Authorization header.
 *                 Attaches req.user = { userId, role } on success.
 *                 Returns 401 if token is missing or invalid.
 *
 * authorize     — factory that returns a middleware checking whether
 *                 req.user.role is in the allowed list.
 *                 Returns 403 if the role is not permitted.
 */

const jwt = require("jsonwebtoken");

// ── Verify JWT and attach user to request ────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload so downstream handlers can use req.user
    req.user = { userId: decoded.userId, role: decoded.role, branch: decoded.branch || null };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ── Role-based authorization factory ─────────────────────────────────────────
// Usage: router.get("/secret", authenticate, authorize("owner", "manager"), handler)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${allowedRoles.join(" or ")}.`,
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
