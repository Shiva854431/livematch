import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')

const FILES = {
  admins: path.join(DATA_DIR, 'admins.json'),
  pending: path.join(DATA_DIR, 'pending.json'),
  store: path.join(DATA_DIR, 'store.json'),
  videos: path.join(DATA_DIR, 'videos.json'),
  images: path.join(DATA_DIR, 'images.json'),
  users: path.join(DATA_DIR, 'users.json'),
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function read(file, fallback) {
  ensureDir()
  if (!fs.existsSync(file)) {
    write(file, fallback)
    return structuredClone(fallback)
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    console.error(`Corrupt data file ${file}, resetting:`, err.message)
    write(file, fallback)
    return structuredClone(fallback)
  }
}

function write(file, data) {
  ensureDir()
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

const emptySport = () => ({
  teams: [],
  upcomingMatches: [],
  currentMatch: null,
  topScorers: [],
  seasonTopScorer: { name: '', stat: 0, team: '' },
})

const defaultStore = () => ({
  cricket: emptySport(),
  kabaddi: emptySport(),
  football: emptySport(),
  basketball: emptySport(),
})

export const storeApi = {
  getAdmins: () => read(FILES.admins, []),
  saveAdmins: (data) => write(FILES.admins, data),

  getPending: () => read(FILES.pending, {}),
  savePending: (data) => write(FILES.pending, data),

  getStore: () => read(FILES.store, defaultStore()),
  saveStore: (data) => write(FILES.store, data),

  getVideos: () => read(FILES.videos, []),
  saveVideos: (data) => write(FILES.videos, data),

  getImages: () => read(FILES.images, []),
  saveImages: (data) => write(FILES.images, data),

  getUsers: () => read(FILES.users, []),
  saveUsers: (data) => write(FILES.users, data),

  hasAdmin: () => storeApi.getAdmins().length > 0,
}
