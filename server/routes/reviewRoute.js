/**
 * Review Routes
 *
 * PUBLIC (customer-facing — no auth required):
 *   GET    /          — Anyone reads reviews (hidden ones excluded server-side)
 *   POST   /          — Customers submit reviews
 *
 * PROTECTED (admin-only — requires JWT with owner role):
 *   GET    /admin      — All reviews including hidden (admin panel)
 *   PATCH  /:id/pin    — Pin a review
 *   PATCH  /:id/hide   — Hide a review
 *   PATCH  /:id/reply  — Reply to a review
 *   DELETE /:id        — Delete a review
 */

const express = require("express");
const router  = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  getReviews,
  getAllReviewsAdmin,
  createReview,
  pinReview,
  hideReview,
  replyToReview,
  deleteReview,
} = require("../controller/reviewController");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",  getReviews);   // public review board (hidden reviews excluded)
router.post("/", createReview); // customers submit reviews

// ── Protected (owner only) ─────────────────────────────────────────────────────
const adminReview = [authenticate, authorize("owner")];

router.get("/admin",         ...adminReview, getAllReviewsAdmin); // all reviews incl. hidden
router.patch("/:id/pin",   ...adminReview, pinReview);
router.patch("/:id/hide",  ...adminReview, hideReview);
router.patch("/:id/reply", ...adminReview, replyToReview);
router.delete("/:id",      ...adminReview, deleteReview);

module.exports = router;
