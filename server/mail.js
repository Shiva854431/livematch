import nodemailer from 'nodemailer'

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendOtpEmail(to, otp, fullName) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"Strider Live" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Strider Live Admin OTP',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0f172a;color:#f1f5f9;border-radius:12px">
        <h2 style="color:#22c55e;margin:0 0 8px">Strider Live Admin</h2>
        <p>Hi ${fullName},</p>
        <p>Your one-time verification code is:</p>
        <p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#22c55e;margin:16px 0">${otp}</p>
        <p style="color:#94a3b8;font-size:13px">Valid for 10 minutes. Do not share this code.</p>
      </div>
    `,
  })
}
