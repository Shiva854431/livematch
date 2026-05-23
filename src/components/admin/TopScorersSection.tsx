import { useState, useEffect } from 'react'
import type { SportData } from '../../types/sportAdmin'

interface TopScorersSectionProps {
  data: SportData
  onSave: (next: SportData) => Promise<void>
}

export function TopScorersSection({ data, onSave }: TopScorersSectionProps) {
  const [localSeasonTop, setLocalSeasonTop] = useState(data.seasonTopScorer)
  const [localTopScorers, setLocalTopScorers] = useState(data.topScorers)
  const [debouncedSeasonTop, setDebouncedSeasonTop] = useState<Partial<SportData['seasonTopScorer']> | null>(null)
  const [debouncedScorer, setDebouncedScorer] = useState<{ playerId: string; patch: Partial<SportData['topScorers'][0]> } | null>(null)

  // Sync local state when data changes
  useEffect(() => {
    setLocalSeasonTop(data.seasonTopScorer)
    setLocalTopScorers(data.topScorers)
  }, [data])

  // Debounced save for season top scorer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSeasonTop) {
        onSave({
          ...data,
          seasonTopScorer: { ...data.seasonTopScorer, ...debouncedSeasonTop },
        })
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [debouncedSeasonTop, data, onSave])

  // Debounced save for individual scorer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedScorer) {
        onSave({
          ...data,
          topScorers: data.topScorers.map((s) =>
            s.playerId === debouncedScorer.playerId ? { ...s, ...debouncedScorer.patch } : s,
          ),
        })
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [debouncedScorer, data, onSave])

  const syncFromPlayers = async () => {
    const scorers = data.teams.flatMap((t) =>
      t.players.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        teamName: t.name,
        matchScore: p.matchScore,
        seasonTotal: p.seasonScore,
      })),
    )
    scorers.sort((a, b) => b.matchScore - a.matchScore)
    const top = scorers[0]
    await onSave({
      ...data,
      topScorers: scorers.slice(0, 10),
      seasonTopScorer: top
        ? { name: top.playerName, stat: top.seasonTotal, team: top.teamName }
        : data.seasonTopScorer,
    })
  }

  const updateSeasonTop = (patch: Partial<SportData['seasonTopScorer']>) => {
    // Update local state immediately for responsive typing
    setLocalSeasonTop(prev => ({ ...prev, ...patch }))
    // Trigger debounced save
    setDebouncedSeasonTop(patch)
  }

  const updateScorer = (
    playerId: string,
    patch: Partial<SportData['topScorers'][0]>,
  ) => {
    // Update local state immediately for responsive typing
    setLocalTopScorers(prev => prev.map(s => s.playerId === playerId ? { ...s, ...patch } : s))
    // Trigger debounced save
    setDebouncedScorer({ playerId, patch })
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-slate-200">Top Scorers</h2>
        <button
          type="button"
          onClick={syncFromPlayers}
          className="px-3 py-1.5 rounded-lg bg-slate-700 text-emerald-400 text-sm font-semibold"
        >
          Sync from player stats
        </button>
      </div>

      <div className="glass rounded-xl p-4 border border-amber-500/20">
        <h3 className="text-xs uppercase text-amber-400 font-bold mb-3">Season Top Scorer</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            placeholder="Player name"
            value={localSeasonTop.name}
            onChange={(e) => updateSeasonTop({ name: e.target.value })}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-sm"
          />
          <input
            type="number"
            placeholder="Total stat"
            value={localSeasonTop.stat}
            onChange={(e) => updateSeasonTop({ stat: Number(e.target.value) || 0 })}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-sm tabular-nums"
          />
          <input
            placeholder="Team"
            value={localSeasonTop.team}
            onChange={(e) => updateSeasonTop({ team: e.target.value })}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-xs uppercase text-slate-500">
              <th className="p-3 text-left">Player</th>
              <th className="p-3">Team</th>
              <th className="p-3">This Match</th>
              <th className="p-3">Season Total</th>
            </tr>
          </thead>
          <tbody>
            {localTopScorers.map((s, i) => (
              <tr key={s.playerId} className="border-t border-slate-700/40">
                <td className="p-2">
                  <span className="text-slate-500 mr-2">#{i + 1}</span>
                  <input
                    value={s.playerName}
                    onChange={(e) => updateScorer(s.playerId, { playerName: e.target.value })}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm w-36"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={s.teamName}
                    onChange={(e) => updateScorer(s.playerId, { teamName: e.target.value })}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={s.matchScore}
                    onChange={(e) =>
                      updateScorer(s.playerId, { matchScore: Number(e.target.value) || 0 })
                    }
                    className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums mx-auto block"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={s.seasonTotal}
                    onChange={(e) =>
                      updateScorer(s.playerId, { seasonTotal: Number(e.target.value) || 0 })
                    }
                    className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums mx-auto block"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {localTopScorers.length === 0 && (
          <p className="p-4 text-sm text-slate-500 text-center">Sync from players or add teams first</p>
        )}
      </div>
    </section>
  )
}
