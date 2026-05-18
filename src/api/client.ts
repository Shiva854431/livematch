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
