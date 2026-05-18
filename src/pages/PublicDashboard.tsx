import { useState } from 'react'
import { Bell, Search, Video, Shield, Radio } from 'lucide-react'
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
  const { state, activeMatch, setActiveMatchId, getMatch } = useMatches()
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all')

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
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 ring-2 ring-white/10 shadow-lg" />
          </div>
        </header>

        <LiveTicker
          matches={state.miniMatches}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          onSelectMatch={loadMatch}
          activeMatchId={state.activeMatchId}
        />

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
