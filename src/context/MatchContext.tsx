import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'
import { INITIAL_STATE, syncMiniFromMatches } from '../data/initialState'
import type { SportStore } from '../types/sportAdmin'
import type {
  AppState,
  LiveMatch,
  Sport,
} from '../types'

interface MatchContextValue {
  state: AppState
  activeMatch: LiveMatch | null
  sportStore: SportStore | null
  setActiveMatchId: (id: string) => void
  getMatch: (id: string) => LiveMatch | undefined
  refresh: () => Promise<void>
}

const MatchContext = createContext<MatchContextValue | null>(null)

function migrateMatch(m: LiveMatch): LiveMatch {
  return {
    ...m,
    isPlaying: m.isPlaying ?? false,
    period: m.period ?? '',
    winner: m.winner ?? null,
    teamA: { ...m.teamA, payoutOnWin: m.teamA.payoutOnWin ?? 0 },
    teamB: { ...m.teamB, payoutOnWin: m.teamB.payoutOnWin ?? 0 },
  }
}

function storeToAppState(store: SportStore, activeId: string): AppState {
  const matches: Record<string, LiveMatch> = {}
  const sports: Sport[] = ['cricket', 'kabaddi', 'football', 'basketball']
  for (const sport of sports) {
    const cm = store[sport]?.currentMatch
    if (cm) matches[cm.id] = migrateMatch({ ...cm, sport })
  }
  const miniFromMatches = syncMiniFromMatches(matches)
  const upcomingMinis = sports.flatMap((sport) =>
    (store[sport]?.upcomingMatches ?? []).map((u) => ({
      id: `up-${u.id}`,
      sport,
      teamA: u.teamAName.slice(0, 3).toUpperCase(),
      teamB: u.teamBName.slice(0, 3).toUpperCase(),
      scoreA: 0,
      scoreB: 0,
      period: new Date(u.scheduledAt).toLocaleString(),
      isLive: false,
      isPlaying: false,
    })),
  )
  const firstId = Object.keys(matches)[0] ?? INITIAL_STATE.activeMatchId
  return {
    matches,
    miniMatches: [...miniFromMatches, ...upcomingMinis],
    activeMatchId: matches[activeId] ? activeId : firstId,
  }
}

export function MatchProvider({ children }: { children: ReactNode }) {
  const [sportStore, setSportStore] = useState<SportStore | null>(null)
  const [state, setState] = useState<AppState>(INITIAL_STATE)

  const refresh = useCallback(async () => {
    try {
      const store = await api.getPublicState()
      setSportStore(store)
      setState((prev) => storeToAppState(store, prev.activeMatchId))
    } catch {
      /* API offline — keep last state */
    }
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 3000)
    return () => clearInterval(t)
  }, [refresh])

  const activeMatch = state.matches[state.activeMatchId] ?? null

  const setActiveMatchId = useCallback((id: string) => {
    setState((s) => ({ ...s, activeMatchId: id }))
  }, [])

  const getMatch = useCallback((id: string) => state.matches[id], [state.matches])

  const value = useMemo(
    () => ({
      state,
      activeMatch,
      sportStore,
      setActiveMatchId,
      getMatch,
      refresh,
    }),
    [state, activeMatch, sportStore, setActiveMatchId, getMatch, refresh],
  )

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
}

export function useMatches() {
  const ctx = useContext(MatchContext)
  if (!ctx) throw new Error('useMatches must be used within MatchProvider')
  return ctx
}
