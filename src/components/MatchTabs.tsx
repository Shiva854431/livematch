import { useState } from 'react'
import type { LiveMatch, Player } from '../types'

type Tab = 'summary' | 'rosters' | 'stats'

interface MatchTabsProps {
  match: LiveMatch
}

function PlayerAvatar({ name, jersey }: { name: string; jersey: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold ring-2 ring-slate-700 shrink-0">
      {initials}
      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-slate-900 text-[9px] flex items-center justify-center font-black text-slate-400 border border-slate-600">
        {jersey}
      </span>
    </div>
  )
}

function PlayerRow({ player, sport }: { player: Player; sport: LiveMatch['sport'] }) {
  const statLabel =
    sport === 'cricket'
      ? player.wickets !== undefined
        ? `${player.wickets} wkts`
        : `${player.runs ?? 0} (${player.balls ?? 0})`
      : `${player.raidPoints ?? 0}R · ${player.tacklePoints ?? 0}T`

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
        player.isActive
          ? 'bg-emerald-500/10 border border-emerald-500/30'
          : 'hover:bg-slate-800/50 border border-transparent'
      }`}
    >
      <div className="relative">
        <PlayerAvatar name={player.name} jersey={player.jersey} />
        {player.isActive && (
          <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{player.name}</p>
        <p className="text-[10px] text-slate-500">#{player.jersey}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold tabular-nums text-slate-300">{statLabel}</p>
        {player.isActive && (
          <p className="text-[10px] font-bold text-emerald-400 uppercase">On Field</p>
        )}
      </div>
    </div>
  )
}

function TeamRoster({ team, sport }: { team: LiveMatch['teamA']; sport: LiveMatch['sport'] }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: team.color }}
        />
        <h3 className="font-bold text-sm">{team.name}</h3>
        <span className="text-xs text-slate-500 ml-auto">{team.abbr}</span>
      </div>
      <div className="space-y-1">
        {team.players.map((p) => (
          <PlayerRow key={p.id} player={p} sport={sport} />
        ))}
      </div>
    </div>
  )
}

export function MatchTabs({ match }: MatchTabsProps) {
  const [tab, setTab] = useState<Tab>('rosters')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: 'Live Summary' },
    { id: 'rosters', label: 'Team Rosters' },
    { id: 'stats', label: 'Key Stats' },
  ]

  return (
    <section className="glass rounded-2xl overflow-hidden mt-4">
      <div className="flex border-b border-slate-700/50 overflow-x-auto scrollbar-thin">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-5 py-3.5 text-sm font-semibold transition-all relative ${
              tab === t.id
                ? 'text-emerald-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6">
        {tab === 'summary' && (
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
            <p>
              <span className="text-white font-semibold">{match.teamA.name}</span> leading with{' '}
              <span className="text-emerald-400 font-bold">{match.teamA.score}</span> against{' '}
              {match.teamB.name}&apos;s {match.teamB.score}.
            </p>
            <p>
              {match.sport === 'cricket' && match.cricket && (
                <>
                  Current run rate <span className="text-white font-bold">{match.cricket.crr}</span>.
                  Required rate{' '}
                  <span className="text-amber-400 font-bold">{match.cricket.rrr}</span> with{' '}
                  {match.cricket.overs} overs bowled.
                </>
              )}
              {match.sport === 'kabaddi' && match.kabaddi && (
                <>
                  {match.kabaddi.raiderName} is raiding with{' '}
                  <span className="text-orange-400 font-bold">{match.kabaddi.raidSeconds}s</span>{' '}
                  remaining on the clock.
                </>
              )}
            </p>
          </div>
        )}

        {tab === 'rosters' && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <TeamRoster team={match.teamA} sport={match.sport} />
            <div className="hidden lg:block w-px bg-slate-700/50 shrink-0" />
            <TeamRoster team={match.teamB} sport={match.sport} />
          </div>
        )}

        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KeyStat label="Total Score" value={`${match.teamA.score + match.teamB.score}`} />
            <KeyStat
              label="Active Players"
              value={String(
                [...match.teamA.players, ...match.teamB.players].filter((p) => p.isActive).length,
              )}
            />
            <KeyStat label="Viewers" value={`${(match.viewers / 1_000_000).toFixed(1)}M`} />
            <KeyStat label="Sport" value={match.sport.toUpperCase()} />
          </div>
        )}
      </div>
    </section>
  )
}

function KeyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p className="text-2xl font-black mt-1 tabular-nums">{value}</p>
    </div>
  )
}
