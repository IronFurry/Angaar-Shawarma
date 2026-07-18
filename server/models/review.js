const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    color: {
      type: String,
      default: "#fff4b8",
    },
    rotate: {
      type: Number,
      default: 0,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    reply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
