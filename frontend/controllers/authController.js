const User = require("../models/User")
const Department = require("../models/Department")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profileImageUrl,
      adminInviteToken,
      vpKey,
      headKey,
      department,
      birthday,
      iasPosition,
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Determine user role
    let role = "member"
    let assignedDepartment = null

    // Check if admin
    if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
      role = "admin"
    }
    // Check if VP with department key
    else if (vpKey) {
      const dept = await Department.findOne({ vpKey, name: department })
      if (!dept) {
        return res.status(400).json({ message: "Invalid VP key or department" })
      }
      role = "vp"
      assignedDepartment = department
    }
    // Check if Head with department key
    else if (headKey) {
      const dept = await Department.findOne({ headKey, name: department })
      if (!dept) {
        return res.status(400).json({ message: "Invalid Head key or department" })
      }
      role = "head"
      assignedDepartment = department
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
      department: assignedDepartment,
      birthday,
      iasPosition,
    })

    // If VP or Head, update department record
    if (role === "vp" || role === "head") {
      const dept = await Department.findOne({ name: assignedDepartment })
      if (dept) {
        if (role === "vp") dept.vp = user._id
        if (role === "head") dept.head = user._id
        await dept.save()
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  // ... existing exports ...
}
