const express = require("express")
const { protect, authorize, vpHeadOnly, adminOnly } = require("../middlewares/authMiddleware")
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController")
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router()

// Get all users (Admin, VP, Head can view their department/all)
router.get("/", protect, authorize(["admin", "vp", "head"]), getUsers)

// Get a specific user
router.get("/:id", protect, getUserById)

// Update a user's profile
router.put("/:id", protect, authorize(["admin", "vp", "head", "member"]), upload.single("profileImage"), updateUser)

// Delete a user (Admin, VP, Head can delete from their department)
router.delete("/:id", protect, authorize(["admin", "vp", "head"]), deleteUser)

module.exports = router
