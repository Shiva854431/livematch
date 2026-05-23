import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, TOKEN_KEY, type AdminProfile, type AuthResponse, type RegisterBody } from '../api/client'

interface AuthContextValue {
  isAdmin: boolean
  admin: AdminProfile | null
  loading: boolean
  hasAdmin: boolean | null
  login: (username: string, password: string) => Promise<void>
  register: (body: RegisterBody) => Promise<void>
  logout: () => void
  refreshStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function saveSession(res: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, res.token)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem(TOKEN_KEY))
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)

  const refreshStatus = useCallback(async () => {
    try {
      const { hasAdmin: exists } = await api.authStatus()
      setHasAdmin(exists)
    } catch {
      setHasAdmin(null)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      await refreshStatus()
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        try {
          const profile = await api.me()
          setAdmin(profile)
          setIsAdmin(true)
        } catch {
          localStorage.removeItem(TOKEN_KEY)
          setIsAdmin(false)
        }
      }
      setLoading(false)
    })()
  }, [refreshStatus])

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password)
    saveSession(res)
    setAdmin(res.admin)
    setIsAdmin(true)
    setHasAdmin(true)
  }, [])

  const register = useCallback(async (body: RegisterBody) => {
    const res = await api.register(body)
    saveSession(res)
    setAdmin(res.admin)
    setIsAdmin(true)
    setHasAdmin(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAdmin(false)
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({
      isAdmin,
      admin,
      loading,
      hasAdmin,
      login,
      register,
      logout,
      refreshStatus,
    }),
    [isAdmin, admin, loading, hasAdmin, login, register, logout, refreshStatus],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
