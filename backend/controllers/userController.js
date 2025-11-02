const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
      let query = { role: "member" }; // Default for admin

      if (req.user.role === "vp" || req.user.role === "head") {
        query = { role: "member", department: req.user.department };
      }

      const users = await User.find(query).select("-password");

      // Add task counts to each user
      const usersWithTaskCounts = await Promise.all(
        users.map(async (user) => {
          const pendingTasks = await Task.countDocuments({
            assignedTo: user._id,
            status: "Pending"
          });
          const inProgressTasks = await Task.countDocuments({
            assignedTo: user._id,
            status: "In Progress"
          });
          const completedTasks = await Task.countDocuments({
            assignedTo: user._id,
            status: "Completed"
          });
          return {
            ...user.toObject(),
            pendingTasks,
            inProgressTasks,
            completedTasks
          };
        })
      );
      res.json(usersWithTaskCounts);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization check
    if (req.user.role !== "admin") {
      if (req.user.role === "vp" || req.user.role === "head") {
        if (user.department !== req.user.department) {
          return res.status(403).json({ message: "Not authorized to view this user" });
        }
      } else if (req.user.role === "member") {
        if (user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to view this user" });
        }
      }
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Authorization Check
    if (req.user.role !== "admin") {
      if (req.user.role === "vp" || req.user.role === "head") {
        // VP/Head can update users in their department
        if (user.department !== req.user.department) {
          return res.status(403).json({ message: "Not authorized to update this user" });
        }
        // Prevent VP/Head from changing role or department
        if (req.body.role && req.body.role !== user.role) {
          return res.status(403).json({ message: "Not authorized to change user role" });
        }
        if (req.body.department && req.body.department !== user.department) {
          return res.status(403).json({ message: "Not authorized to change user department" });
        }
      } else if (req.user.role === "member") {
        // Member can only update their own profile
        if (user._id.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Not authorized to update this user" });
        }
      }
    }

    const { name, email, password, birthday, iasPosition, role, department } = req.body; // Include role and department for admin updates

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.birthday = birthday || user.birthday;
    user.iasPosition = iasPosition || user.iasPosition;

    // Admin can update role and department
    if (req.user.role === "admin") {
      user.role = role || user.role;
      user.department = department || user.department;
    }

    if (req.file) {
      user.profileImageUrl = `/uploads/${req.file.filename}`;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      birthday: updatedUser.birthday,
      iasPosition: updatedUser.iasPosition,
      department: updatedUser.department, // Include department in response
      token: req.headers.authorization.split(" ")[1] // Keep the token the same
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Authorization Check
        if (req.user.role !== "admin") {
          if (req.user.role === "vp" || req.user.role === "head") {
            // VP/Head can delete users in their department
            if (user.department !== req.user.department) {
              return res.status(403).json({ message: "Not authorized to delete this user" });
            }
          } else { // Member role
            return res.status(403).json({ message: "Not authorized to delete users" });
          }
        }
        
        await user.deleteOne();

        res.json({ message: "User removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };

