import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, USER_TOKEN_KEY, type UserProfile, type UserRegisterBody, type UserAuthResponse } from '../api/client'

interface UserContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (body: UserRegisterBody) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  addFavoriteTeam: (teamId: string) => Promise<void>
  removeFavoriteTeam: (teamId: string) => Promise<void>
  addFavoritePlayer: (playerId: string) => Promise<void>
  removeFavoritePlayer: (playerId: string) => Promise<void>
  addFavoriteMatch: (matchId: string) => Promise<void>
  removeFavoriteMatch: (matchId: string) => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

function saveUserSession(res: UserAuthResponse) {
  localStorage.setItem(USER_TOKEN_KEY, res.token)
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(USER_TOKEN_KEY)
    if (token) {
      api.userMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem(USER_TOKEN_KEY)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.userLogin(username, password)
    saveUserSession(res)
    setUser(res.user)
  }, [])

  const register = useCallback(async (body: UserRegisterBody) => {
    const res = await api.userRegister(body)
    saveUserSession(res)
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(USER_TOKEN_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const updated = await api.updateUserProfile(data)
    setUser(updated)
  }, [])

  const addFavoriteTeam = useCallback(async (teamId: string) => {
    const updated = await api.addFavoriteTeam(teamId)
    setUser(updated)
  }, [])

  const removeFavoriteTeam = useCallback(async (teamId: string) => {
    const updated = await api.removeFavoriteTeam(teamId)
    setUser(updated)
  }, [])

  const addFavoritePlayer = useCallback(async (playerId: string) => {
    const updated = await api.addFavoritePlayer(playerId)
    setUser(updated)
  }, [])

  const removeFavoritePlayer = useCallback(async (playerId: string) => {
    const updated = await api.removeFavoritePlayer(playerId)
    setUser(updated)
  }, [])

  const addFavoriteMatch = useCallback(async (matchId: string) => {
    const updated = await api.addFavoriteMatch(matchId)
    setUser(updated)
  }, [])

  const removeFavoriteMatch = useCallback(async (matchId: string) => {
    const updated = await api.removeFavoriteMatch(matchId)
    setUser(updated)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      addFavoriteTeam,
      removeFavoriteTeam,
      addFavoritePlayer,
      removeFavoritePlayer,
      addFavoriteMatch,
      removeFavoriteMatch,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      addFavoriteTeam,
      removeFavoriteTeam,
      addFavoritePlayer,
      removeFavoritePlayer,
      addFavoriteMatch,
      removeFavoriteMatch,
    ],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
