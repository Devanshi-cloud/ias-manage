const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["TECH", "MEDIA", "COMMUNICATION", "FINANCE", "HOSPITALITY"],
      unique: true,
      required: true,
    },
    vpKey: { type: String, required: true },
    headKey: { type: String, required: true },
    vp: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Department", DepartmentSchema)
