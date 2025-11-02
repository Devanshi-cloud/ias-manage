const express = require("express");
const { protect, adminOnly, authorize } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getDepartmentDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, authorize(['admin']), getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/department-dashboard-data", protect, authorize(['vp', 'head']), getDepartmentDashboardData);

router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID

router.post("/", protect, authorize(['admin', 'vp', 'head']), createTask); // Create a task (Admin, VP, Head)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, authorize(['admin', 'vp', 'head']), deleteTask); // Delete a task (Admin, VP, Head)

router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

module.exports = router;
