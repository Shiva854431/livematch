import { Play, Pause, Trophy } from 'lucide-react'
import type { LiveMatch, Player, Sport, WinnerSide } from '../../types'
import type { SportData, TeamRecord } from '../../types/sportAdmin'

const uid = () => crypto.randomUUID()

function teamToLiveSide(t: TeamRecord, sport: Sport) {
  return {
    name: t.name,
    abbr: t.abbr,
    score: 0,
    logo: t.abbr,
    color: t.color,
    payoutOnWin: 0,
    players: t.players.map((p) => ({
      id: p.id,
      name: p.name,
      jersey: p.jersey,
      isActive: false,
      runs: sport === 'cricket' ? p.matchScore : undefined,
      balls: sport === 'cricket' ? 0 : undefined,
      raidPoints: sport === 'kabaddi' ? p.matchScore : undefined,
      tacklePoints: sport === 'kabaddi' ? 0 : undefined,
    })),
  }
}

interface LiveMatchSectionProps {
  sport: Sport
  data: SportData
  onSave: (next: SportData) => Promise<void>
}

export function LiveMatchSection({ sport, data, onSave }: LiveMatchSectionProps) {
  const match = data.currentMatch

  const createFromTeams = async (teamAId: string, teamBId: string) => {
    const a = data.teams.find((t) => t.id === teamAId)
    const b = data.teams.find((t) => t.id === teamBId)
    if (!a || !b) return
    const m: LiveMatch = {
      id: uid(),
      sport,
      status: 'scheduled',
      isPlaying: false,
      stadium: '',
      tournament: '',
      period: sport === 'cricket' ? '0.0 ov' : 'Q1',
      viewers: 0,
      teamA: teamToLiveSide(a, sport),
      teamB: teamToLiveSide(b, sport),
      winner: null,
      winMargin: '',
      topScorer: { name: '', score: 0, team: '' },
      ...(sport === 'cricket'
        ? {
            cricket: {
              overs: '0.0',
              crr: 0,
              rrr: 0,
              striker: { name: '', runs: 0, balls: 0 },
              nonStriker: { name: '', runs: 0, balls: 0 },
              bowler: { name: '', overs: '0', wickets: 0, runs: 0 },
            },
          }
        : {}),
      ...(sport === 'kabaddi'
        ? {
            kabaddi: {
              raidSeconds: 30,
              technicalA: 0,
              technicalB: 0,
              bonusA: 0,
              bonusB: 0,
              tackleA: 0,
              tackleB: 0,
              raiderActive: true,
              raiderName: '',
            },
          }
        : {}),
    }
    await onSave({ ...data, currentMatch: m })
  }

  const patchMatch = async (patch: Partial<LiveMatch>) => {
    if (!match) return
    await onSave({ ...data, currentMatch: { ...match, ...patch } })
  }

  const patchTeam = async (side: 'teamA' | 'teamB', patch: Partial<LiveMatch['teamA']>) => {
    if (!match) return
    await onSave({ ...data, currentMatch: { ...match, [side]: { ...match[side], ...patch } } })
  }

  const setScore = async (side: 'teamA' | 'teamB', score: number) => {
    await patchTeam(side, { score: Math.max(0, score) })
    
    // Auto-calculate cricket statistics when score changes
    if (sport === 'cricket' && match?.cricket) {
      const overs = parseFloat(match.period.replace(' ov', '')) || 0
      const teamScore = Math.max(0, score)
      const crr = overs > 0 ? teamScore / overs : 0
      await patchMatch({ cricket: { ...match.cricket, crr: Math.round(crr * 100) / 100 } })
    }
  }

  const setPlayer = async (
    side: 'teamA' | 'teamB',
    playerId: string,
    patch: Partial<Player>,
  ) => {
    if (!match) return
    const updatedPlayers = match[side].players.map((p) => (p.id === playerId ? { ...p, ...patch } : p))
    
    // Auto-calculate cricket statistics
    if (sport === 'cricket' && match.cricket) {
      const updatedPlayer = updatedPlayers.find(p => p.id === playerId)
      if (updatedPlayer && updatedPlayer.runs !== undefined && updatedPlayer.balls !== undefined) {
        // Calculate strike rate: (runs / balls) * 100
        const strikeRate = updatedPlayer.balls > 0 ? (updatedPlayer.runs / updatedPlayer.balls) * 100 : 0
        updatedPlayer.strikeRate = Math.round(strikeRate * 100) / 100
      }
    }
    
    await onSave({
      ...data,
      currentMatch: {
        ...match,
        [side]: {
          ...match[side],
          players: updatedPlayers,
        },
      },
    })
  }

  const setWinner = async (winner: WinnerSide) => {
    await patchMatch({
      winner,
      status: winner ? 'finished' : match?.status ?? 'live',
      isPlaying: winner ? false : match?.isPlaying,
    })
  }

  if (!match) {
    const t0 = data.teams[0]?.id ?? ''
    const t1 = data.teams[1]?.id ?? ''
    return (
      <section className="glass rounded-xl p-6 text-center space-y-4">
        <p className="text-slate-400">No live match for this sport yet.</p>
        {data.teams.length >= 2 ? (
          <button
            type="button"
            onClick={() => createFromTeams(t0, t1)}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm"
          >
            Create live match from first two teams
          </button>
        ) : (
          <p className="text-xs text-amber-400">Add at least 2 teams first</p>
        )}
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => patchMatch({ isPlaying: !match.isPlaying, status: !match.isPlaying ? 'live' : 'break' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            match.isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500 text-slate-950'
          }`}
        >
          {match.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {match.isPlaying ? 'Stop' : 'Start'} Match
        </button>
        <select
          value={match.status}
          onChange={(e) => patchMatch({ status: e.target.value as LiveMatch['status'] })}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm"
        >
          <option value="scheduled">Scheduled</option>
          <option value="live">Live</option>
          <option value="break">Break</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="text-slate-500 text-xs uppercase">Current location / stadium</span>
          <input
            value={match.stadium}
            onChange={(e) => patchMatch({ stadium: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-500 text-xs uppercase">Tournament</span>
          <input
            value={match.tournament}
            onChange={(e) => patchMatch({ tournament: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-500 text-xs uppercase">Period / Overs</span>
          <input
            value={match.period}
            onChange={(e) => patchMatch({ period: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-500 text-xs uppercase">Win by (margin)</span>
          <input
            value={match.winMargin ?? ''}
            onChange={(e) => patchMatch({ winMargin: e.target.value })}
            placeholder="e.g. 5 runs, 3 points"
            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(['teamA', 'teamB'] as const).map((side) => (
          <div key={side} className="glass rounded-xl p-4">
            <p className="font-bold mb-2">{match[side].name}</p>
            <div className="flex items-center gap-2 mb-3">
              <button type="button" onClick={() => setScore(side, match[side].score - 1)} className="h-9 w-9 rounded bg-slate-700 font-bold">−</button>
              <input
                type="number"
                value={match[side].score}
                onChange={(e) => setScore(side, Number(e.target.value) || 0)}
                className="flex-1 text-center text-2xl font-black tabular-nums bg-slate-900 rounded-lg py-1 border border-slate-600"
              />
              <button type="button" onClick={() => setScore(side, match[side].score + 1)} className="h-9 w-9 rounded bg-emerald-600 font-bold">+</button>
            </div>
            <label className="text-xs text-slate-500">Payout if wins (₹)</label>
            <input
              type="number"
              value={match[side].payoutOnWin}
              onChange={(e) => patchTeam(side, { payoutOnWin: Number(e.target.value) || 0 })}
              className="w-full mt-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
            />
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 border border-amber-500/20">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4" /> Winner & Top Scorer (this match)
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" onClick={() => setWinner('teamA')} className="px-3 py-1.5 rounded-lg bg-slate-800 text-sm font-semibold">{match.teamA.abbr} Wins</button>
          <button type="button" onClick={() => setWinner('teamB')} className="px-3 py-1.5 rounded-lg bg-slate-800 text-sm font-semibold">{match.teamB.abbr} Wins</button>
          <button type="button" onClick={() => setWinner(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-sm text-slate-500">Clear</button>
        </div>
        <div className="grid md:grid-cols-3 gap-2">
          <input
            placeholder="Top scorer name"
            value={match.topScorer?.name ?? ''}
            onChange={(e) => patchMatch({ topScorer: { ...match.topScorer!, name: e.target.value, score: match.topScorer?.score ?? 0, team: match.topScorer?.team ?? '' } })}
            className="px-2 py-1.5 rounded bg-slate-900 border border-slate-600 text-sm"
          />
          <input
            type="number"
            placeholder="Score"
            value={match.topScorer?.score ?? 0}
            onChange={(e) => patchMatch({ topScorer: { name: match.topScorer?.name ?? '', score: Number(e.target.value) || 0, team: match.topScorer?.team ?? '' } })}
            className="px-2 py-1.5 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
          />
          <input
            placeholder="Team"
            value={match.topScorer?.team ?? ''}
            onChange={(e) => patchMatch({ topScorer: { name: match.topScorer?.name ?? '', score: match.topScorer?.score ?? 0, team: e.target.value } })}
            className="px-2 py-1.5 rounded bg-slate-900 border border-slate-600 text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-bold mb-3">Player stats (live)</h3>
        {(['teamA', 'teamB'] as const).map((side) => (
          <div key={side} className="mb-4">
            <p className="text-xs text-slate-500 uppercase mb-2">{match[side].name}</p>
            {match[side].players.map((p) => (
              <div key={p.id} className="flex flex-wrap gap-2 items-center py-1.5 border-b border-slate-800 last:border-0">
                <span className="w-28 text-sm font-medium truncate">{p.name} #{p.jersey}</span>
                <label className="text-xs flex items-center gap-1">
                  <input type="checkbox" checked={p.isActive} onChange={(e) => setPlayer(side, p.id, { isActive: e.target.checked })} />
                  Active
                </label>
                {sport === 'cricket' && (
                  <>
                    <input type="number" value={p.runs ?? 0} onChange={(e) => setPlayer(side, p.id, { runs: Number(e.target.value) })} className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-slate-600 text-xs" title="Runs" />
                    <input type="number" value={p.balls ?? 0} onChange={(e) => setPlayer(side, p.id, { balls: Number(e.target.value) })} className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-slate-600 text-xs" title="Balls" />
                    <span className="text-xs text-emerald-400 w-16">SR: {p.strikeRate ? p.strikeRate.toFixed(1) : '0.0'}</span>
                  </>
                )}
                {sport === 'kabaddi' && (
                  <>
                    <input type="number" value={p.raidPoints ?? 0} onChange={(e) => setPlayer(side, p.id, { raidPoints: Number(e.target.value) })} className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-slate-600 text-xs" title="Raid" />
                    <input type="number" value={p.tacklePoints ?? 0} onChange={(e) => setPlayer(side, p.id, { tacklePoints: Number(e.target.value) })} className="w-14 px-1 py-0.5 rounded bg-slate-900 border border-slate-600 text-xs" title="Tackle" />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {sport === 'cricket' && match.cricket && (
        <div className="glass rounded-xl p-4 border border-emerald-500/20">
          <h3 className="text-sm font-bold text-emerald-400 mb-3">Cricket Statistics (Auto-calculated)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-xs text-slate-500">Current Run Rate</span>
              <p className="text-lg font-bold">{match.cricket.crr.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Required Run Rate</span>
              <p className="text-lg font-bold">{match.cricket.rrr.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Overs</span>
              <p className="text-lg font-bold">{match.period}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Target</span>
              <input
                type="number"
                value={(match.cricket as any)?.target || 0}
                onChange={(e) => {
                  const target = Number(e.target.value)
                  const overs = parseFloat(match.period.replace(' ov', '')) || 0
                  const remainingOvers = 20 - overs
                  const chasingScore = match.teamB.score
                  const runsNeeded = target - chasingScore
                  const rrr = remainingOvers > 0 ? runsNeeded / remainingOvers : 0
                  const updatedCricket = { ...match.cricket, rrr: Math.round(rrr * 100) / 100 } as any
                  patchMatch({ cricket: updatedCricket })
                }}
                className="w-full mt-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                placeholder="Set target"
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700">
            <span className="text-xs text-slate-500">Bowler Stats</span>
            <div className="flex gap-2 mt-2">
              <input
                value={match.cricket?.bowler?.name || ''}
                onChange={(e) => {
                  if (!match.cricket?.bowler) return
                  patchMatch({ cricket: { ...match.cricket, bowler: { ...match.cricket.bowler, name: e.target.value } } })
                }}
                className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                placeholder="Bowler name"
              />
              <input
                type="number"
                value={match.cricket?.bowler?.overs || ''}
                onChange={(e) => {
                  if (!match.cricket?.bowler) return
                  const overs = Number(e.target.value)
                  patchMatch({ cricket: { ...match.cricket, bowler: { ...match.cricket.bowler, overs: overs.toString() } } })
                }}
                className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                title="Overs"
              />
              <input
                type="number"
                value={match.cricket?.bowler?.wickets || ''}
                onChange={(e) => {
                  if (!match.cricket?.bowler) return
                  patchMatch({ cricket: { ...match.cricket, bowler: { ...match.cricket.bowler, wickets: Number(e.target.value) } } })
                }}
                className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                title="Wickets"
              />
              <input
                type="number"
                value={match.cricket?.bowler?.runs || ''}
                onChange={(e) => {
                  if (!match.cricket?.bowler) return
                  const runs = Number(e.target.value)
                  patchMatch({ cricket: { ...match.cricket, bowler: { ...match.cricket.bowler, runs } } })
                }}
                className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                title="Runs given"
              />
              <span className="text-xs text-emerald-400 w-16">Eco: {(() => {
                if (!match.cricket?.bowler) return '0.00'
                const runs = match.cricket.bowler.runs
                const overs = Number(match.cricket.bowler.overs)
                const economy = overs > 0 ? runs / overs : 0
                return economy.toFixed(2)
              })()}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
