const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Token to Role and Department Mapping
const TOKEN_MAPPINGS = {
  // Admin
  [process.env.ADMIN_INVITE_TOKEN]: { role: "admin", department: null },
  
  // VP Tokens
  [process.env.VP_TECH_TOKEN]: { role: "vp", department: "TECH" },
  [process.env.VP_FINANCE_TOKEN]: { role: "vp", department: "FINANCE" },
  [process.env.VP_COMMUNICATION_TOKEN]: { role: "vp", department: "COMMUNICATION" },
  [process.env.VP_DESIGN_TOKEN]: { role: "vp", department: "DESIGN AND MEDIA" },
  [process.env.VP_HOSPITALITY_TOKEN]: { role: "vp", department: "HOSPITALITY" },
  
  // Head Tokens
  [process.env.HEAD_TECH_TOKEN]: { role: "head", department: "TECH" },
  [process.env.HEAD_FINANCE_TOKEN]: { role: "head", department: "FINANCE" },
  [process.env.HEAD_COMMUNICATION_TOKEN]: { role: "head", department: "COMMUNICATION" },
  [process.env.HEAD_DESIGN_TOKEN]: { role: "head", department: "DESIGN AND MEDIA" },
  [process.env.HEAD_HOSPITALITY_TOKEN]: { role: "head", department: "HOSPITALITY" },
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, inviteToken } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Determine user role and department based on invite token
    let role = "member";
    let department = null;

    if (inviteToken && TOKEN_MAPPINGS[inviteToken]) {
      role = TOKEN_MAPPINGS[inviteToken].role;
      department = TOKEN_MAPPINGS[inviteToken].department;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
      department,
    });

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Rest of the controller functions remain the same...
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    let query = { role: "member" }; // Base query for members only

    if (req.user.role === "vp" || req.user.role === "head") {
      // VP and Head can only see members whose iasPosition matches their department
      query = { 
        role: "member", 
        iasPosition: req.user.department // Match iasPosition with VP/Head's department
      };
    }
    // Admin sees all members (no additional filter)

    const users = await User.find(query).select("-password");

    // Add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending"
        });
        const inProgressTasks = await Task.countDocounts({
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profileImageUrl = req.body.profileImageUrl || user.profileImageUrl;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};