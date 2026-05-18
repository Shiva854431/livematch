import type { AppState, LiveMatch, MiniMatch } from '../types'

function withPayout(
  match: Omit<LiveMatch, 'id' | 'isPlaying' | 'period' | 'winner'> & {
    id: string
    period?: string
    isPlaying?: boolean
    winner?: LiveMatch['winner']
  },
): LiveMatch {
  return {
    ...match,
    isPlaying: match.isPlaying ?? false,
    period: match.period ?? '',
    winner: match.winner ?? null,
    teamA: { ...match.teamA, payoutOnWin: match.teamA.payoutOnWin ?? 0 },
    teamB: { ...match.teamB, payoutOnWin: match.teamB.payoutOnWin ?? 0 },
  }
}

const cricket: LiveMatch = withPayout({
  id: '1',
  sport: 'cricket',
  status: 'live',
  isPlaying: true,
  period: '18.4 ov',
  stadium: 'Wankhede Stadium, Mumbai',
  tournament: 'IPL 2026 · Match 42',
  viewers: 2847591,
  winner: null,
  teamA: {
    name: 'Mumbai Indians',
    abbr: 'MI',
    score: 187,
    logo: 'MI',
    color: '#004BA0',
    payoutOnWin: 50000,
    players: [
      { id: '1', name: 'Rohit Sharma', jersey: 45, isActive: true, runs: 68, balls: 42 },
      { id: '2', name: 'Suryakumar Yadav', jersey: 63, isActive: true, runs: 42, balls: 28 },
      { id: '3', name: 'Hardik Pandya', jersey: 33, isActive: false, runs: 31, balls: 18 },
      { id: '4', name: 'Jasprit Bumrah', jersey: 93, isActive: false, wickets: 2 },
      { id: '5', name: 'Tilak Varma', jersey: 9, isActive: false, runs: 24, balls: 16 },
    ],
  },
  teamB: {
    name: 'Chennai Super Kings',
    abbr: 'CSK',
    score: 142,
    logo: 'CSK',
    color: '#FDB913',
    payoutOnWin: 45000,
    players: [
      { id: '6', name: 'Ruturaj Gaikwad', jersey: 31, isActive: true, runs: 52, balls: 38 },
      { id: '7', name: 'MS Dhoni', jersey: 7, isActive: true, runs: 28, balls: 19 },
      { id: '8', name: 'Ravindra Jadeja', jersey: 8, isActive: false, wickets: 1 },
      { id: '9', name: 'Deepak Chahar', jersey: 90, isActive: false, wickets: 3 },
      { id: '10', name: 'Matheesha Pathirana', jersey: 97, isActive: true, wickets: 0 },
    ],
  },
  cricket: {
    overs: '18.4',
    crr: 10.12,
    rrr: 12.5,
    striker: { name: 'R. Sharma', runs: 68, balls: 42 },
    nonStriker: { name: 'S. Yadav', runs: 42, balls: 28 },
    bowler: { name: 'M. Pathirana', overs: '3.4', wickets: 0, runs: 41 },
  },
})

const kabaddi: LiveMatch = withPayout({
  id: '2',
  sport: 'kabaddi',
  status: 'live',
  isPlaying: true,
  period: 'Q3 · 08:12',
  stadium: 'Thyagaraj Sports Complex, Delhi',
  tournament: 'Pro Kabaddi League · Season 11',
  viewers: 892340,
  winner: null,
  teamA: {
    name: 'Puneri Paltan',
    abbr: 'PUN',
    score: 34,
    logo: 'PUN',
    color: '#F97316',
    payoutOnWin: 25000,
    players: [
      { id: 'k1', name: 'Pawan Sehrawat', jersey: 1, isActive: true, raidPoints: 12, tacklePoints: 0 },
      { id: 'k2', name: 'Sandeep Narwal', jersey: 5, isActive: true, raidPoints: 0, tacklePoints: 4 },
      { id: 'k3', name: 'Aslam Inamdar', jersey: 7, isActive: false, raidPoints: 6, tacklePoints: 1 },
      { id: 'k4', name: 'Fazel Atrachali', jersey: 99, isActive: true, raidPoints: 0, tacklePoints: 6 },
    ],
  },
  teamB: {
    name: 'Bengal Warriors',
    abbr: 'BEN',
    score: 28,
    logo: 'BEN',
    color: '#1E40AF',
    payoutOnWin: 22000,
    players: [
      { id: 'k5', name: 'Maninder Singh', jersey: 10, isActive: false, raidPoints: 8, tacklePoints: 0 },
      { id: 'k6', name: 'Shubham Shinde', jersey: 3, isActive: true, raidPoints: 0, tacklePoints: 3 },
      { id: 'k7', name: 'Dinesh', jersey: 8, isActive: true, raidPoints: 4, tacklePoints: 2 },
      { id: 'k8', name: 'Nitin Kumar', jersey: 12, isActive: false, raidPoints: 5, tacklePoints: 1 },
    ],
  },
  kabaddi: {
    raidSeconds: 18,
    technicalA: 2,
    technicalB: 1,
    bonusA: 3,
    bonusB: 2,
    tackleA: 8,
    tackleB: 6,
    raiderActive: true,
    raiderName: 'Pawan Sehrawat',
  },
})

export function matchToMini(m: LiveMatch): MiniMatch {
  return {
    id: m.id,
    sport: m.sport,
    teamA: m.teamA.abbr,
    teamB: m.teamB.abbr,
    scoreA: m.teamA.score,
    scoreB: m.teamB.score,
    period: m.period,
    isLive: m.status === 'live' && m.isPlaying,
    isPlaying: m.isPlaying,
  }
}

export function syncMiniFromMatches(matches: Record<string, LiveMatch>): MiniMatch[] {
  const managed = Object.values(matches).map(matchToMini)
  const extra: MiniMatch[] = [
    {
      id: '3',
      sport: 'football',
      teamA: 'MCI',
      teamB: 'LIV',
      scoreA: 2,
      scoreB: 1,
      period: "72'",
      isLive: false,
      isPlaying: false,
    },
    {
      id: '4',
      sport: 'basketball',
      teamA: 'LAL',
      teamB: 'BOS',
      scoreA: 98,
      scoreB: 94,
      period: 'Q4 04:22',
      isLive: false,
      isPlaying: false,
    },
  ]
  return [...managed, ...extra]
}

export const INITIAL_STATE: AppState = {
  matches: { '1': cricket, '2': kabaddi },
  miniMatches: [],
  activeMatchId: '1',
}

INITIAL_STATE.miniMatches = syncMiniFromMatches(INITIAL_STATE.matches)

export const STORAGE_KEY = 'strider-live-state'
export const AUTH_KEY = 'strider-live-admin'
