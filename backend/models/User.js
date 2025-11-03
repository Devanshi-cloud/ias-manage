const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    
    // Birthday and Position
    birthday: { type: Date, default: null },
    iasPosition: {
      type: String,
      enum: ["COMMUNICATION", "FINANCE", "DESIGN AND MEDIA", "TECH", "HOSPITALITY", "Other", null],
      default: null
    },
    
    role: { 
      type: String, 
      enum: ['admin', 'vp', 'head', 'member'], 
      default: 'member' 
    },
    department: { 
      type: String, 
      enum: ['COMMUNICATION', 'FINANCE', 'DESIGN AND MEDIA', 'TECH', 'HOSPITALITY'],
      required: function() { 
        // Department required for non-admin users
        return this.role !== 'admin'; 
      }
    },
    
    // Reference to supervisor (VP or Head)
    supervisor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      default: null 
    },
    
    // For VPs and Heads - their team members
    teamMembers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    
    // Birthday reminder sent flag (reset annually)
    lastBirthdayReminderYear: { type: Number, default: null }
  },
  { timestamps: true }
);

// Index for efficient queries
UserSchema.index({ role: 1, department: 1 });
UserSchema.index({ supervisor: 1 });
UserSchema.index({ birthday: 1 });

module.exports = mongoose.model("User", UserSchema);