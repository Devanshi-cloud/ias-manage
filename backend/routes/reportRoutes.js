const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = express.Router();

// Export all tasks as Excel/PDF (Admin Only)
router.get("/export/tasks", protect, authorize(['admin', 'vp', 'head']), exportTasksReport);

// Export user-task report (Admin Only)
router.get("/export/users", protect, authorize(['admin', 'vp', 'head']), exportUsersReport);

module.exports = router;
