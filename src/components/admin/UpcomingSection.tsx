import { Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { SportData, UpcomingMatchRecord } from '../../types/sportAdmin'

const uid = () => crypto.randomUUID()

interface UpcomingSectionProps {
  data: SportData
  onSave: (next: SportData) => Promise<void>
}

export function UpcomingSection({ data, onSave }: UpcomingSectionProps) {
  const [localUpcoming, setLocalUpcoming] = useState(data.upcomingMatches)
  const [debouncedUpdate, setDebouncedUpdate] = useState<{ id: string; patch: Partial<UpcomingMatchRecord> } | null>(null)

  // Sync local state when data changes
  useEffect(() => {
    setLocalUpcoming(data.upcomingMatches)
  }, [data])

  // Debounced save to reduce "saving" flashes while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedUpdate) {
        onSave({
          ...data,
          upcomingMatches: data.upcomingMatches.map((m) => (m.id === debouncedUpdate.id ? { ...m, ...debouncedUpdate.patch } : m)),
        })
      }
    }, 1500) // 1.5s debounce to reduce frequent saves
    return () => clearTimeout(timer)
  }, [debouncedUpdate, data, onSave])

  const add = async () => {
    const t1 = data.teams[0]
    const t2 = data.teams[1]
    const m: UpcomingMatchRecord = {
      id: uid(),
      teamAId: t1?.id ?? '',
      teamBId: t2?.id ?? '',
      teamAName: t1?.name ?? 'Team A',
      teamBName: t2?.name ?? 'Team B',
      scheduledAt: new Date().toISOString().slice(0, 16),
      location: '',
      tournament: '',
      notes: '',
    }
    await onSave({ ...data, upcomingMatches: [...data.upcomingMatches, m] })
  }

  const update = (id: string, patch: Partial<UpcomingMatchRecord>) => {
    // Update local state immediately for responsive typing
    setLocalUpcoming(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
    // Trigger debounced save
    setDebouncedUpdate({ id, patch })
  }

  const remove = async (id: string) => {
    await onSave({ ...data, upcomingMatches: data.upcomingMatches.filter((m) => m.id !== id) })
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-200">Upcoming Matches</h2>
        <button
          type="button"
          onClick={add}
          disabled={data.teams.length < 2}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> Add Match
        </button>
      </div>

      {localUpcoming.length === 0 ? (
        <p className="text-sm text-slate-500">Add at least 2 teams, then create upcoming fixtures.</p>
      ) : (
        <div className="space-y-3">
          {localUpcoming.map((m) => (
            <div key={m.id} className="glass rounded-xl p-4 grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-slate-500">Team A</label>
                <select
                  value={m.teamAId}
                  onChange={(e) => {
                    const t = data.teams.find((x) => x.id === e.target.value)
                    update(m.id, { teamAId: e.target.value, teamAName: t?.name ?? '' })
                  }}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-sm"
                >
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500">Team B</label>
                <select
                  value={m.teamBId}
                  onChange={(e) => {
                    const t = data.teams.find((x) => x.id === e.target.value)
                    update(m.id, { teamBId: e.target.value, teamBName: t?.name ?? '' })
                  }}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-sm"
                >
                  {data.teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500">Date & Time</label>
                <input
                  type="datetime-local"
                  value={m.scheduledAt}
                  onChange={(e) => update(m.id, { scheduledAt: e.target.value })}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500">Location / Stadium</label>
                <input
                  value={m.location}
                  onChange={(e) => update(m.id, { location: e.target.value })}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500">Tournament</label>
                <input
                  value={m.tournament}
                  onChange={(e) => update(m.id, { tournament: e.target.value })}
                  className="w-full mt-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-sm"
                />
              </div>
              <div className="flex items-end justify-end">
                <button type="button" onClick={() => remove(m.id)} className="text-red-400 p-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
