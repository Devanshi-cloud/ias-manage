const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },

    role: {
      type: String,
      enum: ["admin", "vp", "head", "member"],
      default: "member",
    },

    department: {
      type: String,
      enum: ["TECH", "MEDIA", "COMMUNICATION", "FINANCE", "HOSPITALITY", null],
      default: null,
    },

    birthday: { type: Date, default: null },

    lastBirthdayReminderYear: { type: Number, default: null },

    position: { type: String, default: null },
    iasPosition: {
      type: String,
      enum: ["COMMUNICATION", "FINANCE", "DESIGN AND MEDIA", "TECH", "HOSPITALITY", "Other", null],
      default: null,
    },
  },
  { timestamps: true },
)

UserSchema.index({ role: 1, department: 1 })
UserSchema.index({ birthday: 1 })

module.exports = mongoose.model("User", UserSchema)
