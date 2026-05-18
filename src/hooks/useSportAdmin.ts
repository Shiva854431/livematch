import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Sport } from '../types'
import { emptySportData, type SportData } from '../types/sportAdmin'

export function useSportAdmin(sport: Sport | '') {
  const [data, setData] = useState<SportData>(emptySportData())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!sport) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.getSport(sport)
      setData(res ?? emptySportData())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [sport])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(
    async (next: SportData) => {
      if (!sport) return
      setSaving(true)
      setError(null)
      try {
        const saved = await api.saveSport(sport, next)
        setData(saved)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save')
        throw e
      } finally {
        setSaving(false)
      }
    },
    [sport],
  )

  const update = useCallback(
    (updater: (prev: SportData) => SportData) => {
      setData((prev) => updater(prev))
    },
    [],
  )

  const persist = useCallback(
    async (updater: (prev: SportData) => SportData) => {
      const next = updater(data)
      await save(next)
    },
    [data, save],
  )

  return { data, setData, loading, saving, error, load, save, update, persist }
}
