const mongoose = require("mongoose");

// Define the sub-schema for todos
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Define the main Task schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Changed to array
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    department: {
      type: String,
      enum: ["COMMUNICATION", "FINANCE", "DESIGN AND MEDIA", "TECH", "HOSPITALITY"],
    },
    attachments: { type: String },
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Export the Task model
module.exports = mongoose.model("Task", taskSchema);