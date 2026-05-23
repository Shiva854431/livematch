import { useState } from 'react'
import { X, Heart, Settings, Bell, Moon, Sun, LogOut, Calendar, Trophy, Users } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useMatches } from '../context/MatchContext'
import type { Route } from '../hooks/useRouter'

interface UserProfileProps {
  onNavigate: (route: Route) => void
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { user, logout, updateProfile, addFavoriteTeam, removeFavoriteTeam, addFavoriteMatch, removeFavoriteMatch } = useUser()
  const { state } = useMatches()
  const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'settings'>('teams')

  if (!user) {
    onNavigate('/user/login')
    return null
  }

  const handleLogout = () => {
    logout()
    onNavigate('/')
  }

  const toggleTheme = () => {
    const newTheme = user.theme === 'dark' ? 'light' : 'dark'
    updateProfile({ theme: newTheme })
  }

  const toggleNotifications = () => {
    updateProfile({ notificationsEnabled: !user.notificationsEnabled })
  }

  const favoriteTeams = state.miniMatches
    .flatMap(m => [m.teamA, m.teamB])
    .filter((_, i, arr) => arr.indexOf(_) === i)
    .filter(teamName => user.favoriteTeams.includes(teamName))

  const favoriteMatches = state.miniMatches.filter(m => user.favoriteMatches.includes(m.id))

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
                <p className="text-sm text-slate-400">@{user.username}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === 'teams'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Favorite Teams
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === 'matches'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Favorite Matches
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'teams' && (
              <div className="space-y-3">
                {favoriteTeams.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No favorite teams yet</p>
                ) : (
                  favoriteTeams.map((team) => (
                    <div
                      key={team}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        <span className="text-white font-medium">{team}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFavoriteTeam(team)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="space-y-3">
                {favoriteMatches.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No favorite matches yet</p>
                ) : (
                  favoriteMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="text-white font-medium">
                            {match.teamA} vs {match.teamB}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{match.period}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFavoriteMatch(match.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    {user.theme === 'dark' ? <Moon className="h-5 w-5 text-slate-400" /> : <Sun className="h-5 w-5 text-slate-400" />}
                    <div>
                      <p className="text-white font-medium">Theme</p>
                      <p className="text-sm text-slate-400">{user.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all text-sm font-medium"
                  >
                    Toggle
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Notifications</p>
                      <p className="text-sm text-slate-400">{user.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                      user.notificationsEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {user.notificationsEnabled ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-white font-medium">Language</p>
                      <p className="text-sm text-slate-400">{user.language || 'English'}</p>
                    </div>
                  </div>
                  <select
                    value={user.language || 'en'}
                    onChange={(e) => updateProfile({ language: e.target.value })}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="te">తెలుగు</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
