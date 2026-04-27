import { describe, it, expect } from 'vitest'
import { getTodayJST, formatDateJST, formatPublishedAt } from '../lib/date'

describe('getTodayJST', () => {
  it('returns a string matching YYYY-MM-DD', () => {
    const result = getTodayJST()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatDateJST', () => {
  it('formats ISO string to MM/DD', () => {
    expect(formatDateJST('2026-04-27')).toBe('4/27')
  })
})

describe('formatPublishedAt', () => {
  it('returns time string from ISO datetime', () => {
    const result = formatPublishedAt('2026-04-27T06:30:00+09:00')
    expect(result).toBe('06:30')
  })

  it('returns empty string for null', () => {
    expect(formatPublishedAt(null)).toBe('')
  })
})
