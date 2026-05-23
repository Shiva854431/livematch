import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendOtpEmail(to, otp, fullName) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SendGrid API key not configured')
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER
  console.log(`Sending OTP email to: ${to} from: ${fromEmail}`)

  try {
    await sgMail.send({
      to,
      from: fromEmail,
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
    console.log(`OTP email sent successfully to: ${to}`)
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error.response?.body || error.message)
    throw error
  }
}

export async function sendOtpSms(mobile, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY
  if (!apiKey) {
    throw new Error('Fast2SMS API key not configured')
  }

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'q',
      message: `Your Strider Live OTP is: ${otp}. Valid for 10 minutes.`,
      language: 'english',
      flash: 0,
      numbers: mobile,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'SMS sending failed')
  }

  return data
}
