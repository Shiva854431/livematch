import { useState } from 'react'
import { X, Trophy, TrendingUp, Users, Star, Minus, Lock } from 'lucide-react'

interface FantasyLeagueProps {
  isOpen: boolean
  onClose: () => void
}

interface FantasyPlayer {
  id: string
  name: string
  team: string
  role: 'BAT' | 'BOWL' | 'AR' | 'WK'
  points: number
  credits: number
  selected: boolean
  selectedBy: number
}

export function FantasyLeague({ isOpen, onClose }: FantasyLeagueProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<FantasyPlayer[]>([])
  const [remainingCredits, setRemainingCredits] = useState(100)
  const [maxCredits] = useState(100)

  // Mock data - in production, this would come from the API
  const players: FantasyPlayer[] = [
    { id: '1', name: 'Virat Kohli', team: 'RCB', role: 'BAT', points: 245, credits: 10.5, selected: false, selectedBy: 85 },
    { id: '2', name: 'MS Dhoni', team: 'CSK', role: 'WK', points: 198, credits: 9.5, selected: false, selectedBy: 78 },
    { id: '3', name: 'Jasprit Bumrah', team: 'MI', role: 'BOWL', points: 187, credits: 9.0, selected: false, selectedBy: 72 },
    { id: '4', name: 'Rashid Khan', team: 'SRH', role: 'BOWL', points: 175, credits: 8.5, selected: false, selectedBy: 65 },
    { id: '5', name: 'Hardik Pandya', team: 'GT', role: 'AR', points: 168, credits: 9.2, selected: false, selectedBy: 68 },
    { id: '6', name: 'Rohit Sharma', team: 'MI', role: 'BAT', points: 156, credits: 9.8, selected: false, selectedBy: 70 },
    { id: '7', name: 'KL Rahul', team: 'LSG', role: 'BAT', points: 149, credits: 9.0, selected: false, selectedBy: 62 },
    { id: '8', name: 'Ravindra Jadeja', team: 'CSK', role: 'AR', points: 142, credits: 8.8, selected: false, selectedBy: 58 },
  ]

  const togglePlayer = (player: FantasyPlayer) => {
    if (player.selected) {
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id))
      setRemainingCredits(prev => prev + player.credits)
    } else {
      if (selectedPlayers.length >= 11) return
      if (remainingCredits < player.credits) return
      setSelectedPlayers(prev => [...prev, { ...player, selected: true }])
      setRemainingCredits(prev => prev - player.credits)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BAT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'BOWL': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'AR': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'WK': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white">Fantasy League</h3>
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              Create Your Team
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

        {/* Team Summary */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{selectedPlayers.length}</p>
                <p className="text-xs text-slate-400">Players</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{remainingCredits.toFixed(1)}</p>
                <p className="text-xs text-slate-400">Credits Left</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {selectedPlayers.reduce((sum, p) => sum + p.points, 0)}
                </p>
                <p className="text-xs text-slate-400">Total Points</p>
              </div>
            </div>
            <button
              type="button"
              disabled={selectedPlayers.length !== 11}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Team
            </button>
          </div>
        </div>

        {/* Player Selection */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              Top Performers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedPlayers.find(p => p.id === player.id)
                      ? 'bg-emerald-500/20 border-emerald-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => togglePlayer(player)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-xs text-slate-400">{player.team}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(player.role)}`}>
                      {player.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="text-slate-300">{player.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span className="text-slate-300">{player.credits} cr</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <Users className="h-3 w-3" />
                    <span>{player.selectedBy}% selected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Team */}
          {selectedPlayers.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                Your Team ({selectedPlayers.length}/11)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{player.name}</p>
                      <p className="text-xs text-slate-400">{player.credits} cr</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePlayer(player)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Max Credits: {maxCredits}</span>
            <span>Max Players: 11</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            <span>Contest locked at match start</span>
          </div>
        </div>
      </div>
    </div>
  )
}
