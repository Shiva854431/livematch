import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import multer from 'multer'
import fs from 'fs'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { storeApi } from './store.js'
import { sendOtpEmail, sendOtpSms } from './mail.js'
import { seedIfEmpty } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

seedIfEmpty()
bootstrapAdminIfNeeded()

// Configure Google OAuth (optional - only if env vars are set)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const users = storeApi.getUsers()
          let user = users.find((u) => u.googleId === profile.id)

          if (!user) {
            // Create new user from Google profile
            user = {
              id: crypto.randomUUID(),
              googleId: profile.id,
              fullName: profile.displayName,
              email: profile.emails[0].value,
              username: profile.emails[0].value.split('@')[0],
              passwordHash: '', // No password needed for Google auth
              theme: 'dark',
              favoriteTeams: [],
              favoritePlayers: [],
              favoriteMatches: [],
              createdAt: new Date().toISOString(),
            }
            users.push(user)
            storeApi.saveUsers(users)
          }

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )
}

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  const users = storeApi.getUsers()
  const user = users.find((u) => u.id === id)
  done(null, user)
})

const app = express()
const PORT = process.env.PORT || 3001

// Configure multer for video uploads
const upload = multer({
  dest: path.join(__dirname, '../public/uploads'),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only video files are allowed'))
    }
  },
})

// Configure multer for image uploads
const uploadImage = multer({
  dest: path.join(__dirname, '../public/uploads/images'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads')
const imagesDir = path.join(__dirname, '../public/uploads/images')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

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
  const username = process.env.BOOTSTRAP_ADMIN_USER
  const password = process.env.BOOTSTRAP_ADMIN_PASS
  if (!username || !password) return

  const admins = storeApi.getAdmins()
  const existingIndex = admins.findIndex((a) => a.username === username)

  if (existingIndex !== -1) {
    // Update existing bootstrap admin with new password
    admins[existingIndex].passwordHash = await bcrypt.hash(password, 10)
    admins[existingIndex].email = process.env.EMAIL_USER ?? admins[existingIndex].email
    storeApi.saveAdmins(admins)
    console.log(`Bootstrap admin updated: username="${username}"`)
  } else {
    // Create new bootstrap admin
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

app.post('/api/auth/register', async (req, res) => {
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

    const admin = {
      id: crypto.randomUUID(),
      fullName,
      mobile,
      state,
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    }
    admins.push(admin)
    storeApi.saveAdmins(admins)

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
    console.error('register', err)
    res.status(500).json({ error: err.message || 'Registration failed' })
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

// ——— User Auth ———

app.post('/api/user/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const users = storeApi.getUsers()
    const user = users.find((u) => u.username === username)
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res.json({
      token,
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        state: user.state,
        theme: user.theme,
      },
    })
  } catch (err) {
    console.error('user/login', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/user/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const users = storeApi.getUsers()
    if (users.some((u) => u.username === username)) {
      return res.status(400).json({ error: 'Username already taken' })
    }
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const user = {
      id: crypto.randomUUID(),
      fullName,
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
      theme: 'dark',
      favoriteTeams: [],
      favoritePlayers: [],
      favoriteMatches: [],
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    storeApi.saveUsers(users)

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res.json({
      token,
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        theme: user.theme,
      },
    })
  } catch (err) {
    console.error('user/register', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

app.get('/api/user/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'No token provided' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const users = storeApi.getUsers()
    const user = users.find((u) => u.id === decoded.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      theme: user.theme,
      favoriteTeams: user.favoriteTeams,
      favoritePlayers: user.favoritePlayers,
      favoriteMatches: user.favoriteMatches,
    })
  } catch (err) {
    console.error('user/me', err)
    res.status(401).json({ error: 'Invalid token' })
  }
})

// ——— Google OAuth ———

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/user/login?error=google_auth_failed' }),
  (req, res) => {
    const user = req.user
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    // Redirect to frontend with token
    res.redirect(`/?token=${token}`)
  }
)

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

// ——— Video highlights ———

app.post('/api/admin/videos/upload', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' })
    }

    const { title, description, category, sport } = req.body
    
    // Generate unique filename
    const videoId = crypto.randomUUID()
    const ext = path.extname(req.file.originalname)
    const newFilename = `${videoId}${ext}`
    const videoPath = path.join(uploadsDir, newFilename)
    
    // Move uploaded file to final location
    fs.renameSync(req.file.path, videoPath)
    
    // Generate video URL
    const videoUrl = `/uploads/${newFilename}`
    
    // Store video metadata
    const videoMetadata = {
      id: videoId,
      title: title || req.file.originalname,
      description: description || '',
      category: category || 'amazing',
      sport: sport || 'cricket',
      videoUrl,
      thumbnail: videoUrl, // In production, generate actual thumbnail
      duration: '0:00', // Will be updated when video is processed
      uploadedAt: Date.now(),
    }
    
    // Save to store
    const videos = storeApi.getVideos() || []
    videos.push(videoMetadata)
    storeApi.saveVideos(videos)
    
    res.json({
      id: videoId,
      url: videoUrl,
      thumbnail: videoUrl,
    })
  } catch (err) {
    console.error('Video upload error:', err)
    res.status(500).json({ error: 'Failed to upload video' })
  }
})

app.get('/api/public/videos/:sport', (req, res) => {
  try {
    const { sport } = req.params
    const videos = storeApi.getVideos() || []
    const sportVideos = videos.filter(v => v.sport === sport)
    res.json(sportVideos)
  } catch (err) {
    console.error('Get videos error:', err)
    res.status(500).json({ error: 'Failed to fetch videos' })
  }
})

app.delete('/api/admin/videos/:videoId', authMiddleware, (req, res) => {
  try {
    const { videoId } = req.params
    const videos = storeApi.getVideos() || []
    const videoIndex = videos.findIndex(v => v.id === videoId)
    
    if (videoIndex === -1) {
      return res.status(404).json({ error: 'Video not found' })
    }
    
    const video = videos[videoIndex]
    
    // Delete video file
    const videoPath = path.join(__dirname, '..', 'public', video.videoUrl)
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath)
    }
    
    // Remove from store
    videos.splice(videoIndex, 1)
    storeApi.saveVideos(videos)
    
    res.json({ success: true })
  } catch (err) {
    console.error('Delete video error:', err)
    res.status(500).json({ error: 'Failed to delete video' })
  }
})

// ——— Match images ———

app.post('/api/admin/images/upload', authMiddleware, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const { caption, category, sport, matchId } = req.body
    
    // Generate unique filename
    const imageId = crypto.randomUUID()
    const ext = path.extname(req.file.originalname)
    const newFilename = `${imageId}${ext}`
    const imagePath = path.join(imagesDir, newFilename)
    
    // Move uploaded file to final location
    fs.renameSync(req.file.path, imagePath)
    
    // Generate image URL
    const imageUrl = `/uploads/images/${newFilename}`
    
    // Store image metadata
    const imageMetadata = {
      id: imageId,
      url: imageUrl,
      caption: caption || req.file.originalname,
      category: category || 'action',
      sport: sport || 'cricket',
      matchId: matchId || null,
      uploadedAt: Date.now(),
    }
    
    // Save to store
    const images = storeApi.getImages() || []
    images.push(imageMetadata)
    storeApi.saveImages(images)
    
    res.json({
      id: imageId,
      url: imageUrl,
    })
  } catch (err) {
    console.error('Image upload error:', err)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

app.get('/api/public/images/:sport', (req, res) => {
  try {
    const { sport } = req.params
    const { matchId } = req.query
    const images = storeApi.getImages() || []
    
    let sportImages = images.filter(img => img.sport === sport)
    
    if (matchId) {
      sportImages = sportImages.filter(img => img.matchId === matchId)
    }
    
    res.json(sportImages)
  } catch (err) {
    console.error('Get images error:', err)
    res.status(500).json({ error: 'Failed to fetch images' })
  }
})

app.delete('/api/admin/images/:imageId', authMiddleware, (req, res) => {
  try {
    const { imageId } = req.params
    const images = storeApi.getImages() || []
    const imageIndex = images.findIndex(img => img.id === imageId)
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' })
    }
    
    const image = images[imageIndex]
    
    // Delete image file
    const imagePath = path.join(__dirname, '..', 'public', image.url)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
    
    // Remove from store
    images.splice(imageIndex, 1)
    storeApi.saveImages(images)
    
    res.json({ success: true })
  } catch (err) {
    console.error('Delete image error:', err)
    res.status(500).json({ error: 'Failed to delete image' })
  }
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
