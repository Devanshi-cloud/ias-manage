const cron = require("node-cron")
const User = require("../models/User")
const Department = require("../models/Department")
const { sendBirthdayReminderToManagers } = require("./emailService")

const startBirthdayScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("[v0] Birthday scheduler running...")
    try {
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")

      // Find users with birthday today
      const users = await User.find({
        $expr: {
          $and: [
            { $eq: [{ $month: "$birthday" }, Number.parseInt(month)] },
            { $eq: [{ $dayOfMonth: "$birthday" }, Number.parseInt(day)] },
          ],
        },
      })

      if (users.length === 0) {
        console.log("[v0] No birthdays today")
        return
      }

      // Send reminders to MEDIA department VP and Head
      const mediaDept = await Department.findOne({ name: "MEDIA" }).populate("vp", "email").populate("head", "email")

      if (mediaDept && mediaDept.vp && mediaDept.head) {
        await sendBirthdayReminderToManagers(mediaDept.vp.email, mediaDept.head.email, users, "MEDIA")
      }

      console.log(`[v0] Birthday reminders sent for ${users.length} user(s)`)
    } catch (error) {
      console.error("[v0] Error in birthday scheduler:", error)
    }
  })

  console.log("[v0] Birthday scheduler started")
}

module.exports = { startBirthdayScheduler }
