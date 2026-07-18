require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db.js");
const cors = require("cors");

// ── Route imports ─────────────────────────────────────────────────────────────
const orderRoute    = require("./routes/orderRoute.js");
const reviewRoute   = require("./routes/reviewRoute.js");
const analyticsRoute = require("./routes/analyticsRoute.js");
const authRoute     = require("./routes/authRoute.js");
const usersRoute    = require("./routes/usersRoute.js");

// ── Middleware imports ────────────────────────────────────────────────────────
const { authenticate, authorize } = require("./middleware/authMiddleware.js");

const app = express();

connectDb();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://angaar-shawarma.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// ── Public routes (no auth required) ─────────────────────────────────────────
// Customer-facing: ordering + reading reviews uses the individual route files
// which selectively apply middleware on specific endpoints only.
app.use("/api/auth", authRoute);

// ── Protected route mounting ──────────────────────────────────────────────────
// Note: selective protection is applied inside each route file so that
// customer-facing endpoints (POST /orders, GET /reviews) remain public.
app.use("/api/orders",    orderRoute);
app.use("/api/reviews",   reviewRoute);

// Analytics is entirely owner-only — protect at mount level
app.use("/api/analytics", authenticate, authorize("owner"), analyticsRoute);

// Users management — admin only
app.use("/api/users", usersRoute);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Angaar Shawarma API is running." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});