import type { LiveMatch, Sport } from '../types'

export interface PlayerRecord {
  id: string
  name: string
  jersey: number
  state: string
  seasonScore: number
  matchScore: number
  seasonBalls?: number
  seasonSixes?: number
  seasonBoundaries?: number
  seasonWickets?: number
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

export interface SeasonStats {
  topRunScorers: { name: string; team: string; runs: number; strikeRate: number }[]
  topWicketTakers: { name: string; team: string; wickets: number }[]
  highestMatchScore: { name: string; team: string; score: number }
  mostSixes: { name: string; team: string; sixes: number }
  mostBoundaries: { name: string; team: string; boundaries: number }
  highestStrikeRate: { name: string; team: string; strikeRate: number }
}

export interface SportData {
  teams: TeamRecord[]
  upcomingMatches: UpcomingMatchRecord[]
  currentMatch: LiveMatch | null
  topScorers: TopScorerRecord[]
  seasonTopScorer: SeasonTopScorer
  seasonStats: SeasonStats
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
    seasonStats: {
      topRunScorers: [],
      topWicketTakers: [],
      highestMatchScore: { name: '', team: '', score: 0 },
      mostSixes: { name: '', team: '', sixes: 0 },
      mostBoundaries: { name: '', team: '', boundaries: 0 },
      highestStrikeRate: { name: '', team: '', strikeRate: 0 },
    },
  }
}
