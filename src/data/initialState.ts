import type { AppState, LiveMatch, MiniMatch } from '../types'

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
  return managed
}

export const INITIAL_STATE: AppState = {
  matches: {},
  miniMatches: [],
  activeMatchId: '',
}

INITIAL_STATE.miniMatches = syncMiniFromMatches(INITIAL_STATE.matches)

export const STORAGE_KEY = 'strider-live-state'
export const AUTH_KEY = 'strider-live-admin'
