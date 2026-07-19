/**
 * Order Routes
 *
 * PUBLIC (customer-facing — no auth required):
 *   POST   /            — Customer creates an order
 *   GET    /bestsellers — Public bestseller sync
 *   GET    /:id         — Customer tracks their own order
 *
 * PROTECTED (requires valid JWT):
 *   GET    /active      — Staff/owner: active orders (contains full PII)
 *   GET    /            — Admin fetches all orders
 *   PATCH  /:id/status  — Admin/staff updates order status
 *   DELETE /:id         — Admin deletes an order
 */

const express = require("express");
const router  = express.Router();
const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrder,
  getOrderById,
  getActiveOrders,
  updateOrderStatus,
  deleteOrder,
  getBestsellers,
} = require("../controller/orderController.js");

// ── Public ────────────────────────────────────────────────────────────────────
router.post("/",           createOrder);    // customers place orders
router.get("/bestsellers", getBestsellers); // public bestseller sync
// NOTE: /active and / must be registered BEFORE /:id — Express matches top-to-bottom
// and /:id would capture "active" as a param ID if placed first.

// ── Protected (requires auth) ────────────────────────────────────────────────
// GET /active contains full customer PII — must not be public
router.get("/active",       authenticate, authorize("owner", "staff"), getActiveOrders);
router.get("/",             authenticate, authorize("owner", "staff"), getOrder);

// Wildcard param routes last — must come after all literal paths
router.get("/:id",         getOrderById);   // customer order tracking
router.patch("/:id/status", authenticate, authorize("owner", "staff"), updateOrderStatus);
router.delete("/:id",       authenticate, authorize("owner", "staff"), deleteOrder);

module.exports = router;