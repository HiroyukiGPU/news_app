import type { Article } from '../types/article'
import { formatPublishedAt } from '../lib/date'
import { getSourceMeta } from '../lib/sources'

type Props = {
  article: Article
  isSaved: boolean
  onSave: (article: Article) => void
  onRemove: (id: string) => void
}

export function ArticleCard({ article, isSaved, onSave, onRemove }: Props) {
  const { emoji, color } = getSourceMeta(article.source)
  const time = formatPublishedAt(article.publishedAt)

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${color} flex items-center gap-1`}>
          <span>{emoji}</span>
          <span>{article.source}</span>
        </span>
        <div className="flex items-center gap-2">
          {article.finalScore > 0 && (
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
              {Math.round(article.finalScore)}
            </span>
          )}
          <button
            onClick={() => (isSaved ? onRemove(article.id) : onSave(article))}
            aria-label={isSaved ? 'あとで読むから削除' : 'あとで読む'}
            className={`transition-colors ${
              isSaved
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
            }`}
          >
            {isSaved ? '★' : '☆'}
          </button>
        </div>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 leading-snug"
      >
        {article.title}
      </a>

      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {article.matchedKeywords.map((kw) => (
          <span
            key={kw}
            className="text-xs px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-medium"
          >
            {kw}
          </span>
        ))}
        {time && (
          <span className="text-xs text-gray-400 dark:text-gray-600 ml-auto">{time}</span>
        )}
      </div>
    </article>
  )
}
