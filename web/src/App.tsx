import { useState, useMemo } from 'react'
import { getTodayJST } from './lib/date'
import { useDailyNews } from './hooks/useDailyNews'
import { useLaterItems } from './hooks/useLaterItems'
import { Header } from './components/Header'
import { Tabs, type TabId } from './components/Tabs'
import { ArticleList } from './components/ArticleList'
import { SourceFilter } from './components/SourceFilter'
import { ErrorState } from './components/ErrorState'
import type { Article, LaterItem } from './types/article'

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00+09:00')
  d.setDate(d.getDate() + days)
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(d)
}

export default function App() {
  const today = getTodayJST()
  const [date, setDate] = useState(today)
  const [activeTab, setActiveTab] = useState<TabId>('top')
  const [activeSource, setActiveSource] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  const newsState = useDailyNews(date + '?' + retryKey)
  const { laterItems, save, remove, isSaved } = useLaterItems()

  const savedIds = useMemo(() => new Set(laterItems.map((i) => i.id)), [laterItems])

  const articles = newsState.status === 'success' ? newsState.data.articles : []
  const sources = newsState.status === 'success' ? newsState.data.sources : []
  const generatedAt = newsState.status === 'success' ? newsState.data.generatedAt : null

  const filteredArticles = useMemo(() => {
    let result = articles
    if (activeSource) result = result.filter((a) => a.source === activeSource)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) => a.title.toLowerCase().includes(q))
    }
    return result
  }, [articles, activeSource, searchQuery])

  const topArticles = useMemo(
    () => [...filteredArticles].sort((a, b) => b.finalScore - a.finalScore).slice(0, 10),
    [filteredArticles],
  )

  const laterAsArticles: Article[] = laterItems.map((item: LaterItem) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    source: item.source,
    publishedAt: null,
    fetchedAt: item.savedAt,
    rawScore: null,
    normalizedScore: 0,
    interestBoost: 0,
    finalScore: 0,
    matchedKeywords: [],
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 max-w-2xl mx-auto">
      <Header
        date={date}
        generatedAt={generatedAt}
        onPrevDay={() => setDate((d) => addDays(d, -1))}
        onNextDay={() => setDate((d) => addDays(d, 1))}
        isNextDisabled={date >= today}
      />
      <Tabs activeTab={activeTab} onChange={setActiveTab} laterCount={laterItems.length} />

      {activeTab !== 'later' && (
        <div className="px-4 pt-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="記事を検索..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {newsState.status === 'loading' && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {newsState.status === 'error' && (
        <ErrorState onRetry={() => setRetryKey((k) => k + 1)} />
      )}

      {(newsState.status === 'success' || newsState.status === 'idle') && (
        <>
          {activeTab === 'top' && (
            <ArticleList
              articles={topArticles}
              savedIds={savedIds}
              onSave={save}
              onRemove={remove}
              emptyMessage="該当する記事がありません"
            />
          )}
          {activeTab === 'all' && (
            <ArticleList
              articles={filteredArticles}
              savedIds={savedIds}
              onSave={save}
              onRemove={remove}
              emptyMessage="該当する記事がありません"
            />
          )}
          {activeTab === 'sources' && (
            <>
              <SourceFilter
                sources={sources}
                activeSource={activeSource}
                onChange={setActiveSource}
              />
              <ArticleList
                articles={filteredArticles}
                savedIds={savedIds}
                onSave={save}
                onRemove={remove}
                emptyMessage="このソースの記事はありません"
              />
            </>
          )}
          {activeTab === 'later' && (
            <ArticleList
              articles={laterAsArticles}
              savedIds={savedIds}
              onSave={save}
              onRemove={remove}
              emptyMessage="気になる記事を保存するとここに表示されます"
            />
          )}
        </>
      )}
    </div>
  )
}
