const express = require("express")
const { protect, authorize } = require("../middlewares/authMiddleware")
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
  getDepartmentDashboardData,
} = require("../controllers/taskController")

const router = express.Router()

router.get("/dashboard-data", protect, authorize(["admin"]), getDashboardData)
router.get("/user-dashboard-data", protect, getUserDashboardData)
router.get("/department-dashboard-data", protect, authorize(["vp", "head"]), getDepartmentDashboardData)

router.get("/", protect, getTasks)
router.get("/:id", protect, getTaskById)

router.post("/", protect, authorize(["admin", "vp", "head"]), createTask)
router.put("/:id", protect, updateTask)
router.delete("/:id", protect, authorize(["admin", "vp", "head"]), deleteTask)

router.put("/:id/status", protect, updateTaskStatus)
router.put("/:id/todo", protect, updateTaskChecklist)

module.exports = router
