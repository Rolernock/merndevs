import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const host = 'smtp.gmail.com'
const port = 587
const user = 'rolernockgoines@gmail.com'
const pass = process.env.SMTP_PASS

const sendEmail = async options => {
  const transporter = await nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  })
  const message = {
    from: `mernDevs <noreply@merndevs.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  }
  await transporter.sendMail(message)
}

export default sendEmail
