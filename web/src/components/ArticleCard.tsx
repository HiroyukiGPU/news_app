import type { Article } from '../types/article'
import { formatPublishedAt } from '../lib/date'

type Props = {
  article: Article
  isSaved: boolean
  onSave: (article: Article) => void
  onRemove: (id: string) => void
}

const SOURCE_COLORS: Record<string, string> = {
  Zenn: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Qiita: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  'はてなブックマーク': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'Hacker News': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

export function ArticleCard({ article, isSaved, onSave, onRemove }: Props) {
  const sourceColor =
    SOURCE_COLORS[article.source] ??
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'

  const time = formatPublishedAt(article.publishedAt)

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sourceColor}`}>
            {article.source}
          </span>
          {article.matchedKeywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            >
              {kw}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {Math.round(article.finalScore)}
          </span>
          <button
            onClick={() => (isSaved ? onRemove(article.id) : onSave(article))}
            aria-label={isSaved ? 'あとで読むから削除' : 'あとで読む'}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-yellow-500'
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
        className="block text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug"
      >
        {article.title}
      </a>

      {time && (
        <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{time}</p>
      )}
    </article>
  )
}
