import { Trophy, TrendingUp, Target, Zap, Award } from 'lucide-react'
import type { Sport } from '../../types'
import type { SportData, SeasonStats } from '../../types/sportAdmin'

interface SeasonStatsSectionProps {
  sport: Sport
  data: SportData
  onSave: (next: SportData) => Promise<void>
}

export function SeasonStatsSection({ sport, data, onSave }: SeasonStatsSectionProps) {
  // TODO: Implement season stats editing UI
  // For now, this is a read-only display

  return (
    <section className="space-y-4">
      <h2 className="font-bold text-slate-200">Season Statistics — {sport}</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Run Scorers */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4" /> Top Run Scorers (Top 5)
          </h3>
          <div className="space-y-2">
            {data.seasonStats.topRunScorers.slice(0, 5).map((player, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 w-4">#{idx + 1}</span>
                  <span className="text-sm">{player.name}</span>
                  <span className="text-xs text-slate-500">({player.team})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{player.runs} runs</span>
                  <span className="text-xs text-emerald-400">SR: {player.strikeRate.toFixed(1)}</span>
                </div>
              </div>
            ))}
            {data.seasonStats.topRunScorers.length === 0 && (
              <p className="text-xs text-slate-500">No data yet</p>
            )}
          </div>
        </div>

        {/* Top Wicket Takers */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <Target className="h-4 w-4" /> Top Wicket Takers
          </h3>
          <div className="space-y-2">
            {data.seasonStats.topWicketTakers.slice(0, 5).map((player, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 w-4">#{idx + 1}</span>
                  <span className="text-sm">{player.name}</span>
                  <span className="text-xs text-slate-500">({player.team})</span>
                </div>
                <span className="text-sm font-bold">{player.wickets} wickets</span>
              </div>
            ))}
            {data.seasonStats.topWicketTakers.length === 0 && (
              <p className="text-xs text-slate-500">No data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Highest Match Score */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <Award className="h-4 w-4" /> Highest Match Score
          </h3>
          {data.seasonStats.highestMatchScore.name ? (
            <div>
              <p className="text-lg font-bold">{data.seasonStats.highestMatchScore.score}</p>
              <p className="text-sm text-slate-400">{data.seasonStats.highestMatchScore.name}</p>
              <p className="text-xs text-slate-500">{data.seasonStats.highestMatchScore.team}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No data yet</p>
          )}
        </div>

        {/* Most Sixes */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4" /> Most Sixes
          </h3>
          {data.seasonStats.mostSixes.name ? (
            <div>
              <p className="text-lg font-bold">{data.seasonStats.mostSixes.sixes}</p>
              <p className="text-sm text-slate-400">{data.seasonStats.mostSixes.name}</p>
              <p className="text-xs text-slate-500">{data.seasonStats.mostSixes.team}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No data yet</p>
          )}
        </div>

        {/* Most Boundaries */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4" /> Most Boundaries
          </h3>
          {data.seasonStats.mostBoundaries.name ? (
            <div>
              <p className="text-lg font-bold">{data.seasonStats.mostBoundaries.boundaries}</p>
              <p className="text-sm text-slate-400">{data.seasonStats.mostBoundaries.name}</p>
              <p className="text-xs text-slate-500">{data.seasonStats.mostBoundaries.team}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No data yet</p>
          )}
        </div>
      </div>

      {/* Highest Strike Rate */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4" /> Highest Strike Rate (Season)
        </h3>
        {data.seasonStats.highestStrikeRate.name ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{data.seasonStats.highestStrikeRate.strikeRate.toFixed(2)}</p>
              <p className="text-sm text-slate-400">{data.seasonStats.highestStrikeRate.name}</p>
              <p className="text-xs text-slate-500">{data.seasonStats.highestStrikeRate.team}</p>
            </div>
            <span className="text-xs text-emerald-400">SR</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No data yet</p>
        )}
      </div>
    </section>
  )
}
