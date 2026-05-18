import type { LiveMatch, Sport } from '../types'

export interface PlayerRecord {
  id: string
  name: string
  jersey: number
  state: string
  seasonScore: number
  matchScore: number
}

export interface TeamRecord {
  id: string
  name: string
  abbr: string
  state: string
  color: string
  players: PlayerRecord[]
  seasonWins: number
  seasonPoints: number
}

export interface UpcomingMatchRecord {
  id: string
  teamAId: string
  teamBId: string
  teamAName: string
  teamBName: string
  scheduledAt: string
  location: string
  tournament: string
  notes?: string
}

export interface TopScorerRecord {
  playerId: string
  playerName: string
  teamName: string
  matchScore: number
  seasonTotal: number
}

export interface SeasonTopScorer {
  name: string
  stat: number
  team: string
}

export interface SportData {
  teams: TeamRecord[]
  upcomingMatches: UpcomingMatchRecord[]
  currentMatch: LiveMatch | null
  topScorers: TopScorerRecord[]
  seasonTopScorer: SeasonTopScorer
}

export type SportStore = Record<Sport, SportData>

export const SPORT_OPTIONS: { value: Sport; label: string }[] = [
  { value: 'cricket', label: 'Cricket' },
  { value: 'kabaddi', label: 'Kabaddi' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
]

export function emptySportData(): SportData {
  return {
    teams: [],
    upcomingMatches: [],
    currentMatch: null,
    topScorers: [],
    seasonTopScorer: { name: '', stat: 0, team: '' },
  }
}
