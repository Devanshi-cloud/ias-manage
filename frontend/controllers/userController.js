const User = require("../models/User")
const Department = require("../models/Department")
const Task = require("../models/Task")
const bcrypt = require("bcryptjs")

const getUsers = async (req, res) => {
  try {
    let query = {}

    // Admin: get all users
    if (req.user.role === "admin") {
      query = {}
    }
    // VP/Head: get users in their department
    else if (req.user.role === "vp" || req.user.role === "head") {
      query = { department: req.user.department }
    }
    // Member: can only view themselves
    else {
      return res.status(403).json({ message: "Not authorized to view users" })
    }

    const users = await User.find(query).select("-password")

    // Add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        })
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        })
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        })
        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks,
        }
      }),
    )
    res.json(usersWithTaskCounts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Authorization check
    if (req.user.role !== "admin") {
      if (req.user.role === "vp" || req.user.role === "head") {
        if (user.department !== req.user.department) {
          return res.status(403).json({ message: "Not authorized to view this user" })
        }
      } else if (req.user.role === "member") {
        if (user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to view this user" })
        }
      }
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Authorization Check
    if (req.user.role !== "admin") {
      if (req.user.role === "vp" || req.user.role === "head") {
        if (user.department !== req.user.department) {
          return res.status(403).json({ message: "Not authorized to update this user" })
        }
        // Prevent VP/Head from changing role or department
        if (req.body.role && req.body.role !== user.role) {
          return res.status(403).json({ message: "Not authorized to change user role" })
        }
        if (req.body.department && req.body.department !== user.department) {
          return res.status(403).json({ message: "Not authorized to change user department" })
        }
      } else if (req.user.role === "member") {
        if (user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to update this user" })
        }
      }
    }

    const { name, email, password, birthday, iasPosition, role, department } = req.body

    // Update fields
    user.name = name || user.name
    user.email = email || user.email
    user.birthday = birthday || user.birthday
    user.iasPosition = iasPosition || user.iasPosition

    // Admin can update role and department
    if (req.user.role === "admin") {
      user.role = role || user.role
      user.department = department || user.department
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      birthday: updatedUser.birthday,
      iasPosition: updatedUser.iasPosition,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Authorization Check
    if (req.user.role !== "admin") {
      if (req.user.role === "vp" || req.user.role === "head") {
        if (user.department !== req.user.department) {
          return res.status(403).json({ message: "Not authorized to delete this user" })
        }
      } else {
        return res.status(403).json({ message: "Not authorized to delete users" })
      }
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "User removed" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser }
