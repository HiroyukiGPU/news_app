import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLaterItems } from '../hooks/useLaterItems'
import type { Article } from '../types/article'

const ARTICLE: Article = {
  id: 'art-1',
  title: 'Test',
  url: 'https://example.com',
  source: 'Zenn',
  publishedAt: null,
  fetchedAt: '2026-04-27T06:00:00+09:00',
  rawScore: null,
  normalizedScore: 50,
  interestBoost: 0,
  finalScore: 50,
  matchedKeywords: [],
}

beforeEach(() => localStorage.clear())

describe('useLaterItems', () => {
  it('starts with empty list', () => {
    const { result } = renderHook(() => useLaterItems())
    expect(result.current.laterItems).toEqual([])
  })

  it('saves an article', () => {
    const { result } = renderHook(() => useLaterItems())
    act(() => result.current.save(ARTICLE))
    expect(result.current.laterItems).toHaveLength(1)
    expect(result.current.isSaved('art-1')).toBe(true)
  })

  it('removes an article', () => {
    const { result } = renderHook(() => useLaterItems())
    act(() => result.current.save(ARTICLE))
    act(() => result.current.remove('art-1'))
    expect(result.current.laterItems).toHaveLength(0)
  })
})
