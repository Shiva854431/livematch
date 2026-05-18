import { ChevronRight, Flame } from 'lucide-react'
import type { MiniMatch, Sport } from '../types'

const sportLabels: Record<Sport, string> = {
  cricket: 'Cricket',
  kabaddi: 'Kabaddi',
  football: 'Football',
  basketball: 'Basketball',
}

interface RightSidebarProps {
  matches: MiniMatch[]
  onSelectMatch: (id: string) => void
  activeMatchId: string
}

export function RightSidebar({ matches, onSelectMatch, activeMatchId }: RightSidebarProps) {
  const liveMatches = matches.filter((m) => m.isPlaying || m.isLive)

  return (
    <aside className="hidden xl:flex w-80 flex-col glass border-l border-white/[0.06] shrink-0">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider">Live Now</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">{liveMatches.length} matches playing</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {liveMatches.map((match) => {
          const isActive = match.id === activeMatchId
          return (
            <button
              key={match.id}
              type="button"
              onClick={() => onSelectMatch(match.id)}
              className={`w-full rounded-2xl p-4 text-left card-hover border transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : 'bg-white/[0.03] border-white/[0.06] hover:border-white/12'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {sportLabels[match.sport]}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 text-[10px] font-bold text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-live" />
                  LIVE
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {match.teamA}
                  </span>
                  <span className="score-display text-xl text-white tabular-nums">{match.scoreA}</span>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {match.teamB}
                  </span>
                  <span className="score-display text-xl text-slate-400 tabular-nums">{match.scoreB}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wide">{match.period}</p>
            </button>
          )
        })}
        {liveMatches.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-8">No live matches</p>
        )}
      </div>

      <div className="p-4 border-t border-white/[0.06]">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors"
        >
          All fixtures
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
