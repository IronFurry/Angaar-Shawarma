const Review = require("../models/review");

// GET public reviews (newest first) — excludes hidden ones
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hidden: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET all reviews including hidden (admin only)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST create a new review
const createReview = async (req, res) => {
  try {
    const { name, text, rating, color, rotate } = req.body;
    if (!name || !text || !rating) {
      return res.status(400).json({ success: false, error: "name, text and rating are required" });
    }
    const review = await Review.create({ name, text, rating, color, rotate });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH toggle pin
const pinReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: "Not found" });
    review.pinned = !review.pinned;
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH toggle hide
const hideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: "Not found" });
    review.hidden = !review.hidden;
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH add/update reply
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getReviews, getAllReviewsAdmin, createReview, pinReview, hideReview, replyToReview, deleteReview };
