import { X, Trophy, Target, TrendingUp, Calendar, Award, Star, Heart } from 'lucide-react'
import type { Player } from '../types'

interface PlayerProfileProps {
  isOpen: boolean
  onClose: () => void
  player: Player
  teamName: string
}

export function PlayerProfile({ isOpen, onClose, player, teamName }: PlayerProfileProps) {
  if (!isOpen) return null

  // Mock statistics - in production, this would come from the API
  const stats = {
    matchesPlayed: 45,
    totalRuns: player.runs || 1250,
    totalWickets: player.wickets || 12,
    strikeRate: player.strikeRate || 145.5,
    average: 42.8,
    highestScore: 98,
    centuries: 3,
    halfCenturies: 8,
    sixes: 45,
    fours: 89,
    catches: 15,
    runOuts: 5,
  }

  const recentMatches = [
    { opponent: 'Team A', runs: 45, balls: 32, result: 'Won' },
    { opponent: 'Team B', runs: 78, balls: 52, result: 'Won' },
    { opponent: 'Team C', runs: 23, balls: 18, result: 'Lost' },
    { opponent: 'Team D', runs: 56, balls: 41, result: 'Won' },
    { opponent: 'Team E', runs: 89, balls: 58, result: 'Won' },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {player.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <p className="text-slate-400 mt-1">{teamName} • Jersey #{player.jersey}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  player.isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                  {player.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-slate-400">Right-handed batsman</span>
              </div>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Season Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Matches" value={stats.matchesPlayed} icon={Calendar} />
            <StatCard label="Runs" value={stats.totalRuns} icon={TrendingUp} />
            <StatCard label="Wickets" value={stats.totalWickets} icon={Target} />
            <StatCard label="Strike Rate" value={stats.strikeRate.toFixed(1)} icon={Star} />
            <StatCard label="Average" value={stats.average.toFixed(1)} icon={Award} />
            <StatCard label="Highest" value={stats.highestScore} icon={Trophy} />
            <StatCard label="100s" value={stats.centuries} icon={Star} />
            <StatCard label="50s" value={stats.halfCenturies} icon={Award} />
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-emerald-400">{stats.sixes}</p>
              <p className="text-sm text-slate-400">Sixes</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-cyan-400">{stats.fours}</p>
              <p className="text-sm text-slate-400">Fours</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-amber-400">{stats.catches}</p>
              <p className="text-sm text-slate-400">Catches</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-purple-400">{stats.runOuts}</p>
              <p className="text-sm text-slate-400">Run Outs</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-red-400">{player.balls || 0}</p>
              <p className="text-sm text-slate-400">Balls Faced</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-blue-400">{stats.average.toFixed(1)}</p>
              <p className="text-sm text-slate-400">Batting Avg</p>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Performances</h3>
          <div className="space-y-2">
            {recentMatches.map((match, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">vs {match.opponent}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{match.runs}</p>
                    <p className="text-xs text-slate-500">Runs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-300">{match.balls}</p>
                    <p className="text-xs text-slate-500">Balls</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      match.result === 'Won'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {match.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-emerald-400" />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
