import { describe, it, expectTypeOf } from 'vitest'
import type { Article, DailyNews, LaterItem } from '../types/article'

describe('Article type', () => {
  it('has required fields', () => {
    const a: Article = {
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
    expectTypeOf(a).toMatchTypeOf<Article>()
  })

  it('DailyNews contains articles array', () => {
    const d: DailyNews = {
      date: '2026-04-27',
      generatedAt: '2026-04-27T06:00:00+09:00',
      sources: ['Zenn'],
      totalCount: 1,
      articles: [],
    }
    expectTypeOf(d).toMatchTypeOf<DailyNews>()
  })
})
