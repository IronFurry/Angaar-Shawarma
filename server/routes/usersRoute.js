/**
 * Users Routes (Admin Management)
 *
 * All routes are protected by authenticate + authorize('owner').
 */

const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  getStaffUsers,
  createStaffUser,
  changePassword,
  deleteUser,
} = require("../controller/usersController");

const adminAuth = [authenticate, authorize("owner")];

router.get("/staff", ...adminAuth, getStaffUsers);
router.post("/staff", ...adminAuth, createStaffUser);
router.patch("/:id/password", ...adminAuth, changePassword);
router.delete("/:id", ...adminAuth, deleteUser);

module.exports = router;
