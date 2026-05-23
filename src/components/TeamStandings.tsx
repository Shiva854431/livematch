import { useState } from 'react'
import { X, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Sport } from '../types'

interface TeamStandingsProps {
  isOpen: boolean
  onClose: () => void
  sport: Sport
}

interface StandingTeam {
  rank: number
  name: string
  abbr: string
  played: number
  won: number
  lost: number
  points: number
  netRunRate: string
  form: Array<'W' | 'L'>
  trend: 'up' | 'down' | 'same'
}

export function TeamStandings({ isOpen, onClose, sport }: TeamStandingsProps) {
  const [selectedTab, setSelectedTab] = useState<'points' | 'wins' | 'runRate'>('points')

  // Mock data - in production, this would come from the API
  const standings: StandingTeam[] = [
    { rank: 1, name: 'Mumbai Indians', abbr: 'MI', played: 12, won: 10, lost: 2, points: 20, netRunRate: '+1.245', form: ['W', 'W', 'W', 'W', 'W'], trend: 'up' },
    { rank: 2, name: 'Chennai Super Kings', abbr: 'CSK', played: 12, won: 9, lost: 3, points: 18, netRunRate: '+0.987', form: ['W', 'W', 'W', 'L', 'W'], trend: 'up' },
    { rank: 3, name: 'Royal Challengers', abbr: 'RCB', played: 12, won: 8, lost: 4, points: 16, netRunRate: '+0.654', form: ['L', 'W', 'W', 'W', 'W'], trend: 'same' },
    { rank: 4, name: 'Kolkata Knight Riders', abbr: 'KKR', played: 12, won: 7, lost: 5, points: 14, netRunRate: '+0.432', form: ['W', 'W', 'L', 'W', 'W'], trend: 'up' },
    { rank: 5, name: 'Delhi Capitals', abbr: 'DC', played: 12, won: 6, lost: 6, points: 12, netRunRate: '-0.123', form: ['L', 'W', 'L', 'W', 'W'], trend: 'down' },
    { rank: 6, name: 'Rajasthan Royals', abbr: 'RR', played: 12, won: 6, lost: 6, points: 12, netRunRate: '-0.234', form: ['W', 'L', 'L', 'W', 'W'], trend: 'same' },
    { rank: 7, name: 'Sunrisers Hyderabad', abbr: 'SRH', played: 12, won: 5, lost: 7, points: 10, netRunRate: '-0.456', form: ['L', 'L', 'W', 'L', 'L'], trend: 'down' },
    { rank: 8, name: 'Punjab Kings', abbr: 'PBKS', played: 12, won: 4, lost: 8, points: 8, netRunRate: '-0.789', form: ['L', 'L', 'L', 'L', 'W'], trend: 'down' },
  ]

  const sortedStandings = [...standings].sort((a, b) => {
    if (selectedTab === 'points') return b.points - a.points
    if (selectedTab === 'wins') return b.won - a.won
    if (selectedTab === 'runRate') {
      const aRate = parseFloat(a.netRunRate)
      const bRate = parseFloat(b.netRunRate)
      return bRate - aRate
    }
    return 0
  })

  const getTrendIcon = (trend: StandingTeam['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 2) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (rank <= 4) return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  const getFormColor = (result: string) => {
    return result === 'W' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white">Team Standings</h3>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium capitalize">
              {sport}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-white/10 flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedTab('points')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTab === 'points'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Points Table
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('wins')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTab === 'wins'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Most Wins
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('runRate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTab === 'runRate'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Net Run Rate
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 sticky top-0">
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Team</th>
                  <th className="px-4 py-3 font-medium text-center">P</th>
                  <th className="px-4 py-3 font-medium text-center">W</th>
                  <th className="px-4 py-3 font-medium text-center">L</th>
                  <th className="px-4 py-3 font-medium text-center">Pts</th>
                  <th className="px-4 py-3 font-medium text-center">NRR</th>
                  <th className="px-4 py-3 font-medium">Form</th>
                  <th className="px-4 py-3 font-medium text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedStandings.map((team) => (
                  <tr key={team.name} className="hover:bg-white/5 transition-all">
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${getRankBadge(
                          team.rank
                        )}`}
                      >
                        {team.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{team.name}</p>
                        <p className="text-xs text-slate-500">{team.abbr}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300">{team.played}</td>
                    <td className="px-4 py-4 text-center text-emerald-400 font-medium">{team.won}</td>
                    <td className="px-4 py-4 text-center text-red-400 font-medium">{team.lost}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">
                        {team.points}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-300">{team.netRunRate}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {team.form.map((result: 'W' | 'L', idx: number) => (
                          <span
                            key={idx}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${getFormColor(
                              result
                            )}`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">{getTrendIcon(team.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-white/10 flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30"></span>
            <span>Playoff Spot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30"></span>
            <span>Elimination Zone</span>
          </div>
          <div className="ml-auto">
            <span className="text-slate-500">P: Played | W: Won | L: Lost | Pts: Points | NRR: Net Run Rate</span>
          </div>
        </div>
      </div>
    </div>
  )
}
