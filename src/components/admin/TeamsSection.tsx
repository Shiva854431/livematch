import { Plus, Trash2 } from 'lucide-react'
import type { Sport } from '../../types'

const uid = () => crypto.randomUUID()
import type { SportData, TeamRecord } from '../../types/sportAdmin'

interface TeamsSectionProps {
  sport: Sport
  data: SportData
  onSave: (next: SportData) => Promise<void>
}

export function TeamsSection({ sport, data, onSave }: TeamsSectionProps) {
  const addTeam = async () => {
    const team: TeamRecord = {
      id: uid(),
      name: 'New Team',
      abbr: 'NT',
      state: '',
      color: '#22c55e',
      players: [],
      seasonWins: 0,
      seasonPoints: 0,
    }
    await onSave({ ...data, teams: [...data.teams, team] })
  }

  const updateTeam = async (id: string, patch: Partial<TeamRecord>) => {
    await onSave({
      ...data,
      teams: data.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })
  }

  const removeTeam = async (id: string) => {
    if (!confirm('Delete this team?')) return
    await onSave({ ...data, teams: data.teams.filter((t) => t.id !== id) })
  }

  const addPlayer = async (teamId: string) => {
    await onSave({
      ...data,
      teams: data.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              players: [
                ...t.players,
                {
                  id: uid(),
                  name: 'Player',
                  jersey: t.players.length + 1,
                  state: t.state,
                  seasonScore: 0,
                  matchScore: 0,
                },
              ],
            }
          : t,
      ),
    })
  }

  const updatePlayer = async (
    teamId: string,
    playerId: string,
    patch: Partial<TeamRecord['players'][0]>,
  ) => {
    await onSave({
      ...data,
      teams: data.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              players: t.players.map((p) => (p.id === playerId ? { ...p, ...patch } : p)),
            }
          : t,
      ),
    })
  }

  const removePlayer = async (teamId: string, playerId: string) => {
    await onSave({
      ...data,
      teams: data.teams.map((t) =>
        t.id === teamId ? { ...t, players: t.players.filter((p) => p.id !== playerId) } : t,
      ),
    })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-200">Teams — {sport}</h2>
        <button
          type="button"
          onClick={addTeam}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> Add Team
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 text-left text-xs uppercase text-slate-500">
              <th className="p-3">Team</th>
              <th className="p-3">Abbr</th>
              <th className="p-3">State</th>
              <th className="p-3">Season Pts</th>
              <th className="p-3">Wins</th>
              <th className="p-3">Players</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.teams.map((team) => (
              <tr key={team.id} className="border-t border-slate-700/40">
                <td className="p-2">
                  <input
                    value={team.name}
                    onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={team.abbr}
                    onChange={(e) => updateTeam(team.id, { abbr: e.target.value.toUpperCase().slice(0, 4) })}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm font-bold"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={team.state}
                    onChange={(e) => updateTeam(team.id, { state: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={team.seasonPoints}
                    onChange={(e) => updateTeam(team.id, { seasonPoints: Number(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={team.seasonWins}
                    onChange={(e) => updateTeam(team.id, { seasonWins: Number(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
                  />
                </td>
                <td className="p-2 text-slate-400">{team.players.length}</td>
                <td className="p-2">
                  <button type="button" onClick={() => removeTeam(team.id)} className="text-red-400 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.teams.map((team) => (
        <div key={team.id} className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">{team.name} — Players</h3>
            <button
              type="button"
              onClick={() => addPlayer(team.id)}
              className="text-xs px-2 py-1 rounded bg-slate-700 text-emerald-400 font-semibold"
            >
              + Add Player
            </button>
          </div>
          <div className="grid gap-2">
            {team.players.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center p-2 rounded-lg bg-slate-800/40"
              >
                <input
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) => updatePlayer(team.id, p.id, { name: e.target.value })}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm col-span-2"
                />
                <input
                  type="number"
                  placeholder="#"
                  value={p.jersey}
                  onChange={(e) => updatePlayer(team.id, p.id, { jersey: Number(e.target.value) || 0 })}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                />
                <input
                  placeholder="State"
                  value={p.state}
                  onChange={(e) => updatePlayer(team.id, p.id, { state: e.target.value })}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm"
                />
                <input
                  type="number"
                  placeholder="Match"
                  title="Match score"
                  value={p.matchScore}
                  onChange={(e) => updatePlayer(team.id, p.id, { matchScore: Number(e.target.value) || 0 })}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Season"
                    title="Season total"
                    value={p.seasonScore}
                    onChange={(e) => updatePlayer(team.id, p.id, { seasonScore: Number(e.target.value) || 0 })}
                    className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-sm tabular-nums"
                  />
                  <button type="button" onClick={() => removePlayer(team.id, p.id)} className="text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {team.players.length === 0 && (
              <p className="text-xs text-slate-500">No players yet</p>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
