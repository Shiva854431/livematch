export type Sport = 'cricket' | 'kabaddi' | 'football' | 'basketball'

export type MatchStatus = 'scheduled' | 'live' | 'break' | 'finished'
export type WinnerSide = 'teamA' | 'teamB' | null

export interface MiniMatch {
  id: string
  sport: Sport
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  period: string
  isLive: boolean
  isPlaying: boolean
}

export interface Player {
  id: string
  name: string
  jersey: number
  isActive: boolean
  runs?: number
  balls?: number
  wickets?: number
  raidPoints?: number
  tacklePoints?: number
}

export interface Team {
  name: string
  abbr: string
  score: number
  logo: string
  color: string
  players: Player[]
  /** Prize / payout if this team wins */
  payoutOnWin: number
}

export interface CricketTelemetry {
  overs: string
  crr: number
  rrr: number
  striker: { name: string; runs: number; balls: number }
  nonStriker: { name: string; runs: number; balls: number }
  bowler: { name: string; overs: string; wickets: number; runs: number }
}

export interface KabaddiTelemetry {
  raidSeconds: number
  technicalA: number
  technicalB: number
  bonusA: number
  bonusB: number
  tackleA: number
  tackleB: number
  raiderActive: boolean
  raiderName: string
}

export interface LiveMatch {
  id: string
  sport: Sport
  status: MatchStatus
  /** When true, match is actively in play and shown on the public live board */
  isPlaying: boolean
  stadium: string
  tournament: string
  period: string
  viewers: number
  teamA: Team
  teamB: Team
  winner: WinnerSide
  /** e.g. "5 runs" or "3 points" */
  winMargin?: string
  topScorer?: { name: string; score: number; team: string }
  cricket?: CricketTelemetry
  kabaddi?: KabaddiTelemetry
}

export interface AppState {
  matches: Record<string, LiveMatch>
  miniMatches: MiniMatch[]
  activeMatchId: string
}
