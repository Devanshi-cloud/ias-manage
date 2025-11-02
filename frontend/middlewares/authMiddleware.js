const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")

      next()
    } else {
      res.status(401).json({ message: "Not authorized, no token" })
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message })
  }
}

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized` })
    }
    next()
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Access denied, admin only" })
  }
}

const vpHeadOnly = (req, res, next) => {
  if (req.user && (req.user.role === "vp" || req.user.role === "head")) {
    next()
  } else {
    res.status(403).json({ message: "Access denied, VP/Head only" })
  }
}

module.exports = { protect, authorize, adminOnly, vpHeadOnly }
