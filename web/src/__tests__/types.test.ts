import { describe, it, expectTypeOf } from 'vitest'
import type { Article, DailyNews, LaterItem } from '../types/article'

const BASE_ARTICLE: Article = {
  id: 'abc',
  title: 'Test',
  url: 'https://example.com',
  source: 'Zenn',
  publishedAt: '2026-04-27T00:00:00+09:00',
  fetchedAt: '2026-04-27T06:00:00+09:00',
  rawScore: 10,
  normalizedScore: 50,
  interestBoost: 15,
  finalScore: 65,
  matchedKeywords: ['AI'],
}

describe('Article type', () => {
  it('publishedAt accepts null', () => {
    const a: Article = { ...BASE_ARTICLE, publishedAt: null }
    expectTypeOf(a.publishedAt).toMatchTypeOf<string | null>()
  })

  it('rawScore accepts null', () => {
    const a: Article = { ...BASE_ARTICLE, rawScore: null }
    expectTypeOf(a.rawScore).toMatchTypeOf<number | null>()
  })

  it('summary is optional', () => {
    const a: Article = { ...BASE_ARTICLE }
    expectTypeOf(a.summary).toMatchTypeOf<string | undefined>()
  })
})

describe('DailyNews type', () => {
  it('contains articles array', () => {
    const d: DailyNews = {
      date: '2026-04-27',
      generatedAt: '2026-04-27T06:00:00+09:00',
      sources: ['Zenn'],
      totalCount: 1,
      articles: [BASE_ARTICLE],
    }
    expectTypeOf(d.articles).toMatchTypeOf<Article[]>()
  })
})

describe('LaterItem type', () => {
  it('has required fields', () => {
    const item: LaterItem = {
      id: 'abc',
      title: 'Test',
      url: 'https://example.com',
      source: 'Zenn',
      savedAt: '2026-04-27T06:00:00+09:00',
    }
    expectTypeOf(item.id).toMatchTypeOf<string>()
    expectTypeOf(item.savedAt).toMatchTypeOf<string>()
  })
})
