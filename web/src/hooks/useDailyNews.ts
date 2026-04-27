import { useState, useEffect } from 'react'
import type { DailyNews } from '../types/article'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: DailyNews }
  | { status: 'error'; message: string }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function useDailyNews(dateKey: string) {
  const [state, setState] = useState<State>({ status: 'idle' })
  const date = dateKey.split('?')[0]

  useEffect(() => {
    if (!DATE_RE.test(date)) {
      setState({ status: 'error', message: 'Invalid date' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    fetch(`/data/${date}.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<DailyNews>
      })
      .then((data) => setState({ status: 'success', data }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setState({ status: 'error', message: err.message })
        }
      })
    return () => controller.abort()
  }, [dateKey])

  return state
}
