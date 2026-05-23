import { useState, useEffect } from 'react'
import { X, Search as SearchIcon, Users, Trophy, Calendar } from 'lucide-react'
import { useMatches } from '../context/MatchContext'
import type { Sport } from '../types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMatch: (matchId: string) => void
}

export function SearchModal({ isOpen, onClose, onSelectMatch }: SearchModalProps) {
  const { state } = useMatches()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    teams: string[]
    matches: Array<{ id: string; teamA: string; teamB: string; sport: Sport; period: string }>
    tournaments: string[]
  }>({ teams: [], matches: [], tournaments: [] })

  useEffect(() => {
    if (!query.trim()) {
      setResults({ teams: [], matches: [], tournaments: [] })
      return
    }

    const lowerQuery = query.toLowerCase()

    // Search teams
    const allTeams = new Set<string>()
    Object.values(state.matches).forEach(match => {
      allTeams.add(match.teamA.name)
      allTeams.add(match.teamB.name)
    })
    const filteredTeams = Array.from(allTeams).filter(team =>
      team.toLowerCase().includes(lowerQuery)
    )

    // Search matches
    const filteredMatches = Object.values(state.matches).filter(match =>
      match.teamA.name.toLowerCase().includes(lowerQuery) ||
      match.teamB.name.toLowerCase().includes(lowerQuery) ||
      match.tournament.toLowerCase().includes(lowerQuery)
    ).map(match => ({
      id: match.id,
      teamA: match.teamA.name,
      teamB: match.teamB.name,
      sport: match.sport,
      period: match.period,
    }))

    // Search tournaments
    const allTournaments = new Set<string>()
    Object.values(state.matches).forEach(match => {
      allTournaments.add(match.tournament)
    })
    const filteredTournaments = Array.from(allTournaments).filter(tournament =>
      tournament.toLowerCase().includes(lowerQuery)
    )

    setResults({
      teams: filteredTeams,
      matches: filteredMatches,
      tournaments: filteredTournaments,
    })
  }, [query, state])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl glass-strong rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <SearchIcon className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, players, tournaments..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-lg"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {!query && (
            <div className="p-8 text-center">
              <SearchIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Start typing to search</p>
              <p className="text-sm text-slate-600 mt-2">Teams, matches, and tournaments</p>
            </div>
          )}

          {query && (
            <div className="p-4 space-y-6">
              {/* Teams */}
              {results.teams.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teams
                  </h3>
                  <div className="space-y-2">
                    {results.teams.map((team) => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => {
                          setQuery(team)
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        <span className="text-white font-medium">{team}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matches */}
              {results.matches.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Matches
                  </h3>
                  <div className="space-y-2">
                    {results.matches.map((match) => (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => {
                          onSelectMatch(match.id)
                          onClose()
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {match.teamA} vs {match.teamB}
                          </span>
                          <span className="text-xs text-slate-400 capitalize">{match.sport}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{match.period}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tournaments */}
              {results.tournaments.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tournaments
                  </h3>
                  <div className="space-y-2">
                    {results.tournaments.map((tournament) => (
                      <button
                        key={tournament}
                        type="button"
                        onClick={() => {
                          setQuery(tournament)
                        }}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        <span className="text-white font-medium">{tournament}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && results.teams.length === 0 && results.matches.length === 0 && results.tournaments.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-slate-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
