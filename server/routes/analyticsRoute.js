const express = require("express");
const router = express.Router();
const { getDashboardAnalytics } = require("../controller/analyticsController");

router.get("/dashboard", getDashboardAnalytics);

module.exports = router;
