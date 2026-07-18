/**
 * User Model
 * Stores admin/staff accounts with hashed passwords.
 * Roles: 'owner' | 'staff'
 *
 * - Passwords are hashed via a pre-save bcrypt hook.
 * - comparePassword() is used at login time.
 * - Staff accounts carry a `branch` field tying them to one outlet.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "staff",
    },

    displayName: {
      type: String,
      trim: true,
    },

    // Only set for role === 'staff'. Matches the full branch name used in orders.
    branch: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────────────────────────────────────
// We use a virtual 'password' setter so callers can do:
//   user.password = "plaintext"
// and it is hashed automatically on save.
userSchema.virtual("password").set(function (plainPassword) {
  this._plainPassword = plainPassword;
});

userSchema.pre("save", async function () {
  // Only hash if a plain password was provided via the virtual setter
  if (!this._plainPassword) return;
  this.passwordHash = await bcrypt.hash(this._plainPassword, SALT_ROUNDS);
});

// ── Compare plain password with stored hash ──────────────────────────────────
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
