import { describe, it, expect, beforeEach } from 'vitest'
import { getLaterItems, saveLaterItem, removeLaterItem, isLaterItem } from '../lib/storage'
import type { LaterItem } from '../types/article'

const ITEM: LaterItem = {
  id: 'test-1',
  title: 'Test Article',
  url: 'https://example.com',
  source: 'Zenn',
  savedAt: '2026-04-27T06:00:00+09:00',
}

beforeEach(() => {
  localStorage.clear()
})

describe('getLaterItems', () => {
  it('returns empty array when nothing saved', () => {
    expect(getLaterItems()).toEqual([])
  })
})

describe('saveLaterItem', () => {
  it('saves an item and returns updated list', () => {
    const result = saveLaterItem(ITEM)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('test-1')
  })

  it('does not duplicate items with same id', () => {
    saveLaterItem(ITEM)
    const result = saveLaterItem(ITEM)
    expect(result).toHaveLength(1)
  })
})

describe('removeLaterItem', () => {
  it('removes item by id', () => {
    saveLaterItem(ITEM)
    const result = removeLaterItem('test-1')
    expect(result).toHaveLength(0)
  })
})

describe('isLaterItem', () => {
  it('returns true if id is saved', () => {
    saveLaterItem(ITEM)
    expect(isLaterItem('test-1')).toBe(true)
  })

  it('returns false if id is not saved', () => {
    expect(isLaterItem('nonexistent')).toBe(false)
  })
})
