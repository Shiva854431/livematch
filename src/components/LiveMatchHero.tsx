import { useEffect, useState } from 'react'
import { Eye, MapPin, Users } from 'lucide-react'
import type { LiveMatch } from '../types'
import { TeamLogo } from './TeamLogo'

interface LiveMatchHeroProps {
  match: LiveMatch
}

function formatViewers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function CricketTelemetry({ match }: { match: LiveMatch }) {
  const t = match.cricket!
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatBox label="Overs" value={t.overs} accent />
      <StatBox label="CRR" value={t.crr.toFixed(2)} />
      <StatBox label="RRR" value={t.rrr.toFixed(2)} highlight />
      <StatBox label="Required" value={`${match.teamB.score}/${match.teamA.score}`} />

      <div className="col-span-2 md:col-span-4 grid md:grid-cols-3 gap-3 mt-1">
        <PlayerChip
          label="Striker"
          name={t.striker.name}
          stat={`${t.striker.runs} (${t.striker.balls})`}
          active
        />
        <PlayerChip
          label="Non-Striker"
          name={t.nonStriker.name}
          stat={`${t.nonStriker.runs} (${t.nonStriker.balls})`}
        />
        <PlayerChip
          label="Bowler"
          name={t.bowler.name}
          stat={`${t.bowler.overs} · ${t.bowler.wickets}/${t.bowler.runs}`}
          variant="bowler"
        />
      </div>
    </div>
  )
}

function KabaddiTelemetry({ match }: { match: LiveMatch }) {
  const t = match.kabaddi!
  const raidPct = (t.raidSeconds / 30) * 100

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl bg-slate-800/60 p-4 border border-orange-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Raid Clock
          </span>
          <span className="text-2xl font-black tabular-nums text-orange-300">{t.raidSeconds}s</span>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
            style={{ width: `${raidPct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {t.raiderActive ? (
            <>
              <span className="text-emerald-400 font-semibold">RAIDER</span>
              {' · '}
              {t.raiderName} on attack
            </>
          ) : (
            <span className="text-sky-400 font-semibold">DEFENCE ACTIVE</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <PointGrid teamA={t.technicalA} teamB={t.technicalB} label="Technical" />
        <PointGrid teamA={t.bonusA} teamB={t.bonusB} label="Bonus" />
        <PointGrid teamA={t.tackleA} teamB={t.tackleB} label="Tackle" highlight />
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  accent,
  highlight,
}: {
  label: string
  value: string
  accent?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : accent
            ? 'bg-slate-800/80 border-slate-600/40'
            : 'bg-slate-800/50 border-slate-700/40'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p
        className={`text-xl font-black tabular-nums mt-0.5 ${
          highlight ? 'text-emerald-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function PlayerChip({
  label,
  name,
  stat,
  active,
  variant,
}: {
  label: string
  name: string
  stat: string
  active?: boolean
  variant?: 'bowler'
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        active
          ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
          : variant === 'bowler'
            ? 'bg-red-500/5 border-red-500/20'
            : 'bg-slate-800/50 border-slate-700/40'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-bold text-sm mt-0.5 truncate">{name}</p>
      <p className="text-lg font-black tabular-nums text-slate-300">{stat}</p>
    </div>
  )
}

function PointGrid({
  teamA,
  teamB,
  label,
  highlight,
}: {
  teamA: number
  teamB: number
  label: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight ? 'bg-sky-500/10 border-sky-500/30' : 'bg-slate-800/50 border-slate-700/40'
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
        {label} Points
      </p>
      <div className="flex justify-between items-end">
        <span className="text-2xl font-black tabular-nums">{teamA}</span>
        <span className="text-slate-600 text-xs">vs</span>
        <span className="text-2xl font-black tabular-nums text-slate-400">{teamB}</span>
      </div>
    </div>
  )
}

export function LiveMatchHero({ match }: LiveMatchHeroProps) {
  const [flashScore, setFlashScore] = useState(false)
  const [displayScoreA, setDisplayScoreA] = useState(match.teamA.score)

  useEffect(() => {
    if (match.teamA.score !== displayScoreA) {
      setFlashScore(true)
      setDisplayScoreA(match.teamA.score)
      const timer = setTimeout(() => setFlashScore(false), 600)
      return () => clearTimeout(timer)
    }
  }, [match.teamA.score, displayScoreA])

  return (
    <section className="glass-strong rounded-3xl overflow-hidden relative animate-fade-up">
      <div className="absolute inset-0 mesh-grid opacity-30 pointer-events-none" />

      <div className="relative p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-8">
          {match.winner ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
              FINISHED
            </span>
          ) : match.isPlaying ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 font-bold border border-red-500/30 glow-live">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-live" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 font-bold border border-slate-600/50">
              SCHEDULED
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {match.stadium}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="font-medium text-slate-300">{match.tournament}</span>
          <span className="ml-auto flex items-center gap-1 text-slate-500">
            <Users className="h-3.5 w-3.5" />
            <Eye className="h-3.5 w-3.5" />
            {formatViewers(match.viewers)} watching
          </span>
        </div>

        <div className="relative rounded-2xl bg-black/30 border border-white/[0.06] p-6 md:p-10 mb-2">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center gap-4 flex-1 order-1">
              <TeamLogo abbr={match.teamA.logo} color={match.teamA.color} size="xl" />
              <div className="text-center">
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-wide uppercase">{match.teamA.name}</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">{match.teamA.abbr}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-6 order-2 py-4">
              <span
                className={`score-display text-6xl md:text-8xl text-white tabular-nums ${
                  flashScore ? 'animate-score-flash glow-score' : ''
                }`}
              >
                {match.teamA.score}
              </span>
              <span className="score-display text-3xl md:text-4xl text-slate-600 font-light">–</span>
              <span className="score-display text-6xl md:text-8xl text-slate-400 tabular-nums">
                {match.teamB.score}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 flex-1 order-3">
              <TeamLogo abbr={match.teamB.logo} color={match.teamB.color} size="xl" />
              <div className="text-center">
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-wide uppercase">{match.teamB.name}</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">{match.teamB.abbr}</p>
              </div>
            </div>
          </div>
        </div>

        {match.winMargin && (
          <p className="text-center text-sm text-amber-400/90 mt-4 font-semibold">
            Win margin: {match.winMargin}
          </p>
        )}
        {match.topScorer?.name && (
          <p className="text-center text-xs text-slate-500 mt-1">
            Top scorer: <span className="text-emerald-400 font-bold">{match.topScorer.name}</span>
            {' '}({match.topScorer.score}) · {match.topScorer.team}
          </p>
        )}

        {match.sport === 'cricket' && match.cricket && <CricketTelemetry match={match} />}
        {match.sport === 'kabaddi' && match.kabaddi && <KabaddiTelemetry match={match} />}
      </div>
    </section>
  )
}
