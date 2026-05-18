import { Circle, Target, Shield, Dribbble } from 'lucide-react'
import type { MiniMatch, Sport } from '../types'

const sportIcons: Record<Sport, typeof Circle> = {
  cricket: Target,
  kabaddi: Shield,
  football: Circle,
  basketball: Dribbble,
}

const sportGradients: Record<Sport, string> = {
  cricket: 'from-amber-500/20 to-amber-600/5 border-amber-500/25',
  kabaddi: 'from-orange-500/20 to-orange-600/5 border-orange-500/25',
  football: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/25',
  basketball: 'from-sky-500/20 to-sky-600/5 border-sky-500/25',
}

interface LiveTickerProps {
  matches: MiniMatch[]
  selectedSport: Sport | 'all'
  onSportChange: (sport: Sport | 'all') => void
  onSelectMatch: (id: string) => void
  activeMatchId: string
}

const sports: (Sport | 'all')[] = ['all', 'cricket', 'kabaddi', 'football', 'basketball']

export function LiveTicker({ matches, selectedSport, onSportChange, onSelectMatch, activeMatchId }: LiveTickerProps) {
  const filtered = selectedSport === 'all' ? matches : matches.filter((m) => m.sport === selectedSport)

  return (
    <div className="broadcast-bar border-b border-white/[0.06] sticky top-0 z-20">
      <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto scrollbar-thin border-b border-white/[0.04]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 mr-1">Sports</span>
        {sports.map((sport) => (
          <button
            key={sport}
            type="button"
            onClick={() => onSportChange(sport)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all duration-200 ${
              selectedSport === sport
                ? 'bg-white text-slate-900 shadow-lg shadow-white/10'
                : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            {sport === 'all' ? 'All' : sport}
          </button>
        ))}
      </div>

      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">No matches in this category</p>
        ) : (
          filtered.map((match, i) => {
            const Icon = sportIcons[match.sport]
            const isActive = match.id === activeMatchId
            return (
              <button
                key={match.id}
                type="button"
                onClick={() => onSelectMatch(match.id)}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`shrink-0 min-w-[172px] rounded-2xl p-3.5 text-left card-hover animate-fade-up bg-gradient-to-br ${
                  sportGradients[match.sport]
                } border ${
                  isActive
                    ? 'ring-2 ring-emerald-400/60 border-emerald-400/40 shadow-lg shadow-emerald-500/10'
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-300">
                    <Icon className="h-3.5 w-3.5 opacity-80" />
                    {match.sport}
                  </span>
                  {match.isPlaying && match.isLive && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/20 text-[10px] font-bold text-red-400 border border-red-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-live" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  {match.teamA} <span className="text-slate-600 font-normal">vs</span> {match.teamB}
                </p>
                <p className="score-display text-2xl text-white mt-1 tabular-nums">
                  {match.scoreA}<span className="text-slate-600 mx-1.5 font-normal text-lg">–</span>{match.scoreB}
                </p>
                <p className="text-[10px] text-slate-500 mt-1.5 font-medium uppercase tracking-wide">{match.period}</p>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
