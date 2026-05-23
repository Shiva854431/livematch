import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { storeApi } from './store.js'
import { sendOtpEmail } from './mail.js'
import { seedIfEmpty } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

seedIfEmpty()
bootstrapAdminIfNeeded()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    req.admin = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/** First-time setup: create admin from .env when no admins exist (no OTP required). */
async function bootstrapAdminIfNeeded() {
  if (storeApi.hasAdmin()) return
  const username = process.env.BOOTSTRAP_ADMIN_USER
  const password = process.env.BOOTSTRAP_ADMIN_PASS
  if (!username || !password) return

  const admins = storeApi.getAdmins()
  admins.push({
    id: crypto.randomUUID(),
    fullName: 'Bootstrap Admin',
    mobile: '0000000000',
    state: 'N/A',
    email: process.env.EMAIL_USER ?? 'admin@local',
    username,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  })
  storeApi.saveAdmins(admins)
  console.log(`Bootstrap admin created: username="${username}" (change password after first login)`)
}

// ——— Health ———

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS) })
})

// ——— Auth ———

app.get('/api/auth/status', (_req, res) => {
  try {
    res.json({ hasAdmin: storeApi.hasAdmin() })
  } catch (err) {
    console.error('auth/status', err)
    res.status(500).json({ error: 'Server storage error' })
  }
})

app.post('/api/auth/register/send-otp', async (req, res) => {
  try {
    const { fullName, mobile, state, email, username, password, confirmPassword } = req.body

    if (!fullName || !mobile || !state || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const admins = storeApi.getAdmins()
    if (admins.some((a) => a.username === username)) {
      return res.status(400).json({ error: 'Username already taken' })
    }
    if (admins.some((a) => a.email === email)) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const otp = generateOtp()
    const pending = storeApi.getPending()
    pending[username] = {
      fullName,
      mobile,
      state,
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }
    storeApi.savePending(pending)

    const devMode = process.env.DEV_OTP === 'true'

    if (devMode) {
      console.log(`[DEV OTP] user="${username}" email=${email} code=${otp}`)
      return res.json({
        success: true,
        message: 'Development mode: use the OTP shown on screen',
        devOtp: otp,
      })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[DEV OTP] Email not configured. user="${username}" code=${otp}`)
      return res.json({
        success: true,
        message: 'Email not configured — use OTP on screen',
        devOtp: otp,
      })
    }

    try {
      await sendOtpEmail(email, otp, fullName)
      res.json({ success: true, message: 'OTP sent to your email' })
    } catch (mailErr) {
      console.error('send-otp email failed:', mailErr.message)
      console.log(`[DEV OTP fallback] user="${username}" code=${otp}`)
      res.json({
        success: true,
        message: 'Email could not be sent (check Gmail app password). Use OTP on screen.',
        devOtp: otp,
      })
    }
  } catch (err) {
    console.error('send-otp', err)
    res.status(500).json({ error: err.message || 'Registration failed' })
  }
})

app.post('/api/auth/register/verify', async (req, res) => {
  try {
    const { username, otp } = req.body
    const pending = storeApi.getPending()
    const record = pending[username]
    if (!record) return res.status(400).json({ error: 'Registration not found. Request OTP again.' })
    if (Date.now() > record.expiresAt) {
      delete pending[username]
      storeApi.savePending(pending)
      return res.status(400).json({ error: 'OTP expired' })
    }
    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' })
    }

    const admins = storeApi.getAdmins()
    const admin = {
      id: crypto.randomUUID(),
      fullName: record.fullName,
      mobile: record.mobile,
      state: record.state,
      email: record.email,
      username: record.username,
      passwordHash: record.passwordHash,
      createdAt: new Date().toISOString(),
    }
    admins.push(admin)
    storeApi.saveAdmins(admins)
    delete pending[username]
    storeApi.savePending(pending)

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res.json({
      token,
      admin: {
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
        state: admin.state,
      },
    })
  } catch (err) {
    console.error('verify', err)
    res.status(500).json({ error: 'Verification failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const admin = storeApi.getAdmins().find((a) => a.username === username)
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res.json({
      token,
      admin: {
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
        state: admin.state,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const admin = storeApi.getAdmins().find((a) => a.id === req.admin.id)
  if (!admin) return res.status(404).json({ error: 'Admin not found' })
  res.json({
    fullName: admin.fullName,
    username: admin.username,
    email: admin.email,
    state: admin.state,
    mobile: admin.mobile,
  })
})

// ——— Public state ———

app.get('/api/public/state', (_req, res) => {
  try {
    res.json(storeApi.getStore())
  } catch (err) {
    console.error('public/state', err)
    res.status(500).json({ error: 'Failed to load state' })
  }
})

// ——— Admin sport data ———

const SPORTS = ['cricket', 'kabaddi', 'football', 'basketball']

app.get('/api/admin/sports/:sport', authMiddleware, (req, res) => {
  const { sport } = req.params
  if (!SPORTS.includes(sport)) return res.status(400).json({ error: 'Invalid sport' })
  const store = storeApi.getStore()
  res.json(store[sport] ?? null)
})

app.put('/api/admin/sports/:sport', authMiddleware, (req, res) => {
  const { sport } = req.params
  if (!SPORTS.includes(sport)) return res.status(400).json({ error: 'Invalid sport' })
  const store = storeApi.getStore()
  store[sport] = req.body
  storeApi.saveStore(store)
  res.json(store[sport])
})

// Serve static files in production (must come after all API routes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')))
  // SPA fallback - serve index.html for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/assets') || req.path.includes('.')) {
      next()
    } else {
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
    }
  })
}

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Strider API running on http://localhost:${PORT}`)
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set in .env')
  }
})
