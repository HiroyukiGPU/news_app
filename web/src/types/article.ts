export type Article = {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string | null
  fetchedAt: string
  rawScore: number | null
  normalizedScore: number
  interestBoost: number
  finalScore: number
  matchedKeywords: string[]
  summary?: string
}

export type DailyNews = {
  date: string
  generatedAt: string
  sources: string[]
  totalCount: number
  articles: Article[]
}

export type LaterItem = {
  id: string
  title: string
  url: string
  source: string
  savedAt: string
}
