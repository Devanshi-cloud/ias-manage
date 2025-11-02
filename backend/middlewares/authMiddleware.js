const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

// Middleware for Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

// Middleware for Vice President-only access
const vicepresidentOnly = (req, res, next) => {
  if (req.user && req.user.role === "vp") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, vice president only" });
  }
};

// Middleware for Head-only access
const headOnly = (req, res, next) => {
  if (req.user && req.user.role === "head") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, head only" });
  }
};

// Middleware for role-based authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, adminOnly, vicepresidentOnly, headOnly, authorize };
