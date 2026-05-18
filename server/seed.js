import { storeApi } from './store.js'

export function seedIfEmpty() {
  const store = storeApi.getStore()
  if (store.cricket?.teams?.length > 0) return

  const cricketTeams = [
    {
      id: 't-mi',
      name: 'Mumbai Indians',
      abbr: 'MI',
      state: 'Maharashtra',
      color: '#004BA0',
      seasonWins: 5,
      seasonPoints: 24,
      players: [
        { id: 'p1', name: 'Rohit Sharma', jersey: 45, state: 'Maharashtra', seasonScore: 420, matchScore: 68 },
        { id: 'p2', name: 'Suryakumar Yadav', jersey: 63, state: 'Maharashtra', seasonScore: 380, matchScore: 42 },
      ],
    },
    {
      id: 't-csk',
      name: 'Chennai Super Kings',
      abbr: 'CSK',
      state: 'Tamil Nadu',
      color: '#FDB913',
      seasonWins: 4,
      seasonPoints: 20,
      players: [
        { id: 'p3', name: 'MS Dhoni', jersey: 7, state: 'Tamil Nadu', seasonScore: 310, matchScore: 28 },
        { id: 'p4', name: 'Ruturaj Gaikwad', jersey: 31, state: 'Maharashtra', seasonScore: 290, matchScore: 52 },
      ],
    },
  ]

  store.cricket = {
    teams: cricketTeams,
    upcomingMatches: [
      {
        id: 'u1',
        teamAId: 't-mi',
        teamBId: 't-csk',
        teamAName: 'Mumbai Indians',
        teamBName: 'Chennai Super Kings',
        scheduledAt: '2026-05-20T19:30',
        location: 'Wankhede Stadium, Mumbai',
        tournament: 'IPL 2026',
      },
    ],
    currentMatch: {
      id: '1',
      sport: 'cricket',
      status: 'live',
      isPlaying: true,
      stadium: 'Wankhede Stadium, Mumbai',
      tournament: 'IPL 2026',
      period: '18.4 ov',
      viewers: 1200000,
      winner: null,
      winMargin: '',
      topScorer: { name: 'Rohit Sharma', score: 68, team: 'MI' },
      teamA: {
        name: 'Mumbai Indians',
        abbr: 'MI',
        score: 187,
        logo: 'MI',
        color: '#004BA0',
        payoutOnWin: 50000,
        players: cricketTeams[0].players.map((p) => ({
          id: p.id,
          name: p.name,
          jersey: p.jersey,
          isActive: true,
          runs: p.matchScore,
          balls: 40,
        })),
      },
      teamB: {
        name: 'Chennai Super Kings',
        abbr: 'CSK',
        score: 142,
        logo: 'CSK',
        color: '#FDB913',
        payoutOnWin: 45000,
        players: cricketTeams[1].players.map((p) => ({
          id: p.id,
          name: p.name,
          jersey: p.jersey,
          isActive: true,
          runs: p.matchScore,
          balls: 35,
        })),
      },
      cricket: {
        overs: '18.4',
        crr: 10.12,
        rrr: 12.5,
        striker: { name: 'R. Sharma', runs: 68, balls: 42 },
        nonStriker: { name: 'S. Yadav', runs: 42, balls: 28 },
        bowler: { name: 'Pathirana', overs: '3.4', wickets: 0, runs: 41 },
      },
    },
    topScorers: [],
    seasonTopScorer: { name: 'Rohit Sharma', stat: 420, team: 'MI' },
  }

  store.kabaddi = {
    teams: [
      {
        id: 't-pun',
        name: 'Puneri Paltan',
        abbr: 'PUN',
        state: 'Maharashtra',
        color: '#F97316',
        seasonWins: 6,
        seasonPoints: 30,
        players: [
          { id: 'k1', name: 'Pawan Sehrawat', jersey: 1, state: 'Haryana', seasonScore: 180, matchScore: 12 },
        ],
      },
      {
        id: 't-ben',
        name: 'Bengal Warriors',
        abbr: 'BEN',
        state: 'West Bengal',
        color: '#1E40AF',
        seasonWins: 4,
        seasonPoints: 22,
        players: [
          { id: 'k2', name: 'Maninder Singh', jersey: 10, state: 'Punjab', seasonScore: 120, matchScore: 8 },
        ],
      },
    ],
    upcomingMatches: [],
    currentMatch: null,
    topScorers: [],
    seasonTopScorer: { name: '', stat: 0, team: '' },
  }

  storeApi.saveStore(store)
  console.log('Seeded default cricket & kabaddi data')
}
