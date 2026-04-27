import { useState, useEffect } from 'react'
import type { DailyNews } from '../types/article'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: DailyNews }
  | { status: 'error'; message: string }

export function useDailyNews(dateKey: string) {
  const [state, setState] = useState<State>({ status: 'idle' })
  const date = dateKey.split('?')[0]

  useEffect(() => {
    setState({ status: 'loading' })
    fetch(`/data/${date}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<DailyNews>
      })
      .then((data) => setState({ status: 'success', data }))
      .catch((err: Error) => setState({ status: 'error', message: err.message }))
  }, [dateKey])

  return state
}
