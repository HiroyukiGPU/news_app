import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const MOCK_DATA = {
  date: '2026-04-27',
  generatedAt: '2026-04-27T06:00:00+09:00',
  sources: ['Zenn'],
  totalCount: 1,
  articles: [
    {
      id: 'z-1',
      title: 'Claude Code Tips',
      url: 'https://zenn.dev/example',
      source: 'Zenn',
      publishedAt: '2026-04-27T05:00:00+09:00',
      fetchedAt: '2026-04-27T06:00:00+09:00',
      rawScore: 100,
      normalizedScore: 80,
      interestBoost: 15,
      finalScore: 95,
      matchedKeywords: ['Claude Code'],
    },
  ],
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_DATA),
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders article title after loading', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Claude Code Tips')).toBeInTheDocument()
    })
  })

  it('shows error state when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    )
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/読み込めませんでした/)).toBeInTheDocument()
    })
  })

  it('switching to All tab still shows article', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Claude Code Tips')).toBeInTheDocument()
    })
    await user.click(screen.getByRole('tab', { name: 'All' }))
    expect(screen.getByText('Claude Code Tips')).toBeInTheDocument()
  })

  it('Later tab shows empty state when nothing saved', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: 'Later' }))
    await waitFor(() => {
      expect(screen.getByText(/気になる記事を保存する/)).toBeInTheDocument()
    })
  })
})
