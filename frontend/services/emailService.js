const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendBirthdayReminder = async (users, department) => {
  try {
    const userList = users.map((user) => `${user.name} (${user.email})`).join(", ")

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Birthday Reminder - ${department} Department`,
      html: `
        <h2>Birthday Reminder</h2>
        <p>The following team member(s) have their birthday today:</p>
        <p><strong>${userList}</strong></p>
        <p>Don't forget to wish them!</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`[v0] Birthday reminder sent for ${department} department`)
    return true
  } catch (error) {
    console.error("[v0] Error sending birthday reminder:", error)
    return false
  }
}

const sendBirthdayReminderToManagers = async (vpEmail, headEmail, users, department) => {
  try {
    const userList = users.map((user) => `${user.name}`).join(", ")

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${vpEmail}, ${headEmail}`,
      subject: `Birthday Reminder - ${department} Department`,
      html: `
        <h2>Birthday Reminder</h2>
        <p>Good morning! The following team member(s) have their birthday today:</p>
        <p><strong>${userList}</strong></p>
        <p>Please take a moment to wish them!</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`[v0] Birthday reminder sent to VP/Head of ${department}`)
    return true
  } catch (error) {
    console.error("[v0] Error sending reminder to managers:", error)
    return false
  }
}

module.exports = { sendBirthdayReminder, sendBirthdayReminderToManagers }
