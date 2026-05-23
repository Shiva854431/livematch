const API = '/api'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('strider-admin-token')
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options?.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.error || res.statusText
    if (res.status === 401) {
      throw new Error(`${msg}. Try username "admin" and password "strider2026" if this is your first time.`)
    }
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  authStatus: () => request<{ hasAdmin: boolean }>('/auth/status'),

  sendOtp: (body: RegisterBody) =>
    request<{ success: boolean; message?: string; devOtp?: string }>('/auth/register/send-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyOtp: (username: string, otp: string) =>
    request<AuthResponse>('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({ username, otp }),
    }),

  login: (username: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () =>
    request<AdminProfile>('/auth/me', { headers: authHeaders() }),

  getPublicState: () => request<import('../types/sportAdmin').SportStore>('/public/state'),

  getSport: (sport: string) =>
    request<import('../types/sportAdmin').SportData>(`/admin/sports/${sport}`),

  saveSport: (sport: string, data: import('../types/sportAdmin').SportData) =>
    request<import('../types/sportAdmin').SportData>(`/admin/sports/${sport}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // User authentication
  userRegister: (body: UserRegisterBody) =>
    request<UserAuthResponse>('/api/user/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  userLogin: (username: string, password: string) =>
    request<UserAuthResponse>('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  userMe: () =>
    request<UserProfile>('/api/user/me', { headers: userAuthHeaders() }),

  updateUserProfile: (data: Partial<UserProfile>) =>
    request<UserProfile>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Favorites
  addFavoriteTeam: (teamId: string) =>
    request<UserProfile>('/user/favorites/team', {
      method: 'POST',
      body: JSON.stringify({ teamId }),
    }),

  removeFavoriteTeam: (teamId: string) =>
    request<UserProfile>('/user/favorites/team', {
      method: 'DELETE',
      body: JSON.stringify({ teamId }),
    }),

  addFavoritePlayer: (playerId: string) =>
    request<UserProfile>('/user/favorites/player', {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    }),

  removeFavoritePlayer: (playerId: string) =>
    request<UserProfile>('/user/favorites/player', {
      method: 'DELETE',
      body: JSON.stringify({ playerId }),
    }),

  addFavoriteMatch: (matchId: string) =>
    request<UserProfile>('/user/favorites/match', {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    }),

  removeFavoriteMatch: (matchId: string) =>
    request<UserProfile>('/user/favorites/match', {
      method: 'DELETE',
      body: JSON.stringify({ matchId }),
    }),

  // Video highlights
  uploadVideo: (file: File, metadata: { title: string; description: string; category: string; sport: string }) => {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', metadata.title)
    formData.append('description', metadata.description)
    formData.append('category', metadata.category)
    formData.append('sport', metadata.sport)

    return request<{ id: string; url: string; thumbnail: string }>('/admin/videos/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  },

  getVideos: (sport: string) =>
    request<Array<{ id: string; title: string; description: string; category: string; thumbnail: string; videoUrl: string; duration: string; uploadedAt: number }>>(`/public/videos/${sport}`),

  deleteVideo: (videoId: string) =>
    request<{ success: boolean }>(`/admin/videos/${videoId}`, {
      method: 'DELETE',
    }),

  // Match images
  uploadImage: (file: File, metadata: { caption: string; category: string; sport: string; matchId?: string }) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('caption', metadata.caption)
    formData.append('category', metadata.category)
    formData.append('sport', metadata.sport)
    if (metadata.matchId) {
      formData.append('matchId', metadata.matchId)
    }

    return request<{ id: string; url: string }>('/admin/images/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  },

  getImages: (sport: string, matchId?: string) => {
    const url = matchId 
      ? `/public/images/${sport}?matchId=${matchId}`
      : `/public/images/${sport}`
    return request<Array<{ id: string; url: string; caption: string; category: string; uploadedAt: number }>>(url)
  },

  deleteImage: (imageId: string) =>
    request<{ success: boolean }>(`/admin/images/${imageId}`, {
      method: 'DELETE',
    }),
}

export interface RegisterBody {
  fullName: string
  mobile: string
  state: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  admin: AdminProfile
}

export interface AdminProfile {
  fullName: string
  username: string
  email: string
  state: string
  mobile?: string
}

export const TOKEN_KEY = 'strider-admin-token'
export const USER_TOKEN_KEY = 'strider-user-token'

export interface UserRegisterBody {
  username: string
  email: string
  password: string
  fullName: string
}

export interface UserAuthResponse {
  token: string
  user: UserProfile
}

export interface UserProfile {
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  favoriteTeams: string[]
  favoritePlayers: string[]
  favoriteMatches: string[]
  notificationsEnabled: boolean
  theme: 'dark' | 'light'
  language: string
  createdAt: string
}

function userAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(USER_TOKEN_KEY)
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}
