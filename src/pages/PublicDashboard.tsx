import { useState } from 'react'
import { Bell, Search, Video, Shield, Radio, User, Settings, Info, X } from 'lucide-react'
import { LeftSidebar } from '../components/LeftSidebar'
import { LiveTicker } from '../components/LiveTicker'
import { LiveMatchHero } from '../components/LiveMatchHero'
import { MatchTabs } from '../components/MatchTabs'
import { RightSidebar } from '../components/RightSidebar'
import { useMatches } from '../context/MatchContext'
import type { Sport } from '../types'
import type { Route } from '../hooks/useRouter'

interface PublicDashboardProps {
  onNavigate: (route: Route) => void
}

export function PublicDashboard({ onNavigate }: PublicDashboardProps) {
  const { state, activeMatch, setActiveMatchId, getMatch, sportStore } = useMatches()
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all')
  const [showProfile, setShowProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const loadMatch = (id: string) => {
    if (getMatch(id)) setActiveMatchId(id)
  }

  const match = activeMatch

  return (
    <div className="flex min-h-screen">
      <LeftSidebar onAdminClick={() => onNavigate('/admin/login')} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-4 md:px-6 py-3.5 border-b border-white/[0.06] glass sticky top-0 z-40">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Radio className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold tracking-wide">STRIDER</span>
          </div>
          <div className="flex-1 relative max-w-lg hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search teams, players, tournaments..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-black/30 border border-white/[0.08] text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-300 text-sm font-medium border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <Info className="h-4 w-4" />
              About
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-300 text-sm font-medium border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-300 text-sm font-medium border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/login')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 text-sm font-medium border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <Shield className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
            >
              <Video className="h-4 w-4" />
              Watch Live
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="sm:hidden h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 ring-2 ring-white/10 shadow-lg flex items-center justify-center"
            >
              <User className="h-5 w-5 text-white" />
            </button>
          </div>
        </header>

        <LiveTicker
          matches={state.miniMatches}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          onSelectMatch={loadMatch}
          activeMatchId={state.activeMatchId}
        />

        {sportStore && (
          <div className="px-4 md:px-6 py-3 border-b border-white/[0.06] glass">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Teams</span>
              {selectedSport !== 'all' ? (
                sportStore[selectedSport as Sport]?.teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-bold text-sm">{team.abbr}</span>
                    <span className="text-sm text-slate-400">{team.name}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  {Object.entries(sportStore).map(([sport, data]) => (
                    <div key={sport} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase">{sport}</span>
                      {data?.teams?.slice(0, 3).map((team) => (
                        <div key={team.id} className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
                          <span className="font-bold text-xs">{team.abbr}</span>
                        </div>
                      ))}
                      {data?.teams && data.teams.length > 3 && (
                        <span className="text-xs text-slate-500">+{data.teams.length - 3}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {selectedSport !== 'all' && (!sportStore[selectedSport as Sport]?.teams || sportStore[selectedSport as Sport]?.teams.length === 0) && (
                <span className="text-xs text-slate-600">No teams yet</span>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
              {!match && (
                <div className="glass-strong rounded-3xl p-16 text-center">
                  <Radio className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-400">Select a live match</p>
                  <p className="text-sm text-slate-600 mt-2">Choose from the ticker above</p>
                </div>
              )}

              {match && !match.isPlaying && match.status !== 'finished' && (
                <div className="glass-strong rounded-2xl p-8 text-center border border-amber-500/20 bg-amber-500/5">
                  <p className="font-display text-xl text-amber-400 uppercase tracking-wide">Upcoming</p>
                  <p className="text-slate-400 mt-2">
                    {match.teamA.name} vs {match.teamB.name}
                  </p>
                </div>
              )}

              {match?.winner && <WinnerBanner match={match} />}

              {match && (match.isPlaying || match.status === 'finished') && (
                <>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-1">
                        {match.isPlaying ? '● Live broadcast' : 'Final result'}
                      </p>
                      <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">
                        {match.teamA.abbr} vs {match.teamB.abbr}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      {Object.values(state.matches).map((m) => (
                        <SportToggle
                          key={m.id}
                          label={m.sport === 'cricket' ? '🏏 Cricket' : '🤼 Kabaddi'}
                          active={state.activeMatchId === m.id}
                          onClick={() => loadMatch(m.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <LiveMatchHero match={match} />
                  <MatchTabs match={match} />
                </>
              )}
            </div>
          </div>

          <RightSidebar
            matches={state.miniMatches}
            onSelectMatch={loadMatch}
            activeMatchId={state.activeMatchId}
          />
        </main>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Profile</h2>
              <button type="button" onClick={() => setShowProfile(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Guest User</p>
                  <p className="text-sm text-slate-400">Welcome to Strider Live</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Account Type</p>
                <p className="font-medium">Public Viewer</p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Favorite Sports</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Cricket</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Kabaddi</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Football</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Basketball</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button type="button" onClick={() => setShowSettings(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Dark Mode</span>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Notifications</span>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Auto-refresh matches</span>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Language</p>
                <select className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-sm">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">About Strider Live</h2>
              <button type="button" onClick={() => setShowAbout(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-3">
                  <Radio className="h-8 w-8 text-white" />
                </div>
                <p className="font-display font-bold tracking-wide text-lg">STRIDER LIVE</p>
                <p className="text-sm text-slate-400">Version 1.0.0</p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Features</p>
                <ul className="text-sm space-y-1">
                  <li>• Live match scores and updates</li>
                  <li>• Multi-sport support (Cricket, Kabaddi, Football, Basketball)</li>
                  <li>• Real-time statistics</li>
                  <li>• Team and player information</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">Contact</p>
                <p className="text-sm">support@striderlive.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WinnerBanner({ match }: { match: NonNullable<ReturnType<typeof useMatches>['activeMatch']> }) {
  if (!match.winner) return null
  const team = match[match.winner]
  return (
    <div className="rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-600/5 to-transparent flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl border border-amber-500/30">
          🏆
        </div>
        <div>
          <p className="font-display text-xl text-amber-400 uppercase tracking-wide">{team.name} wins</p>
          <p className="text-sm text-slate-400 mt-0.5">
            {match.teamA.score} – {match.teamB.score}
            {match.winMargin ? ` · by ${match.winMargin}` : ''}
          </p>
        </div>
      </div>
      <p className="text-2xl font-black text-emerald-400 tabular-nums">
        ₹{team.payoutOnWin.toLocaleString('en-IN')}
      </p>
    </div>
  )
}

function SportToggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
        active
          ? 'bg-white text-slate-900 shadow-md'
          : 'text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}
