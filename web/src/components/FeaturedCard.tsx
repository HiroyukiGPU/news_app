import type { Article } from '../types/article'
import { formatPublishedAt } from '../lib/date'
import { getSourceMeta } from '../lib/sources'

type Props = {
  article: Article
  isSaved: boolean
  onSave: (article: Article) => void
  onRemove: (id: string) => void
}

export function FeaturedCard({ article, isSaved, onSave, onRemove }: Props) {
  const { emoji } = getSourceMeta(article.source)
  const time = formatPublishedAt(article.publishedAt)

  return (
    <article className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-indigo-950 dark:to-gray-900 rounded-2xl p-5 shadow-lg text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
            {emoji} {article.source}
          </span>
          {article.matchedKeywords.slice(0, 2).map((kw) => (
            <span
              key={kw}
              className="text-xs font-medium bg-white/10 px-1.5 py-0.5 rounded text-blue-100"
            >
              {kw}
            </span>
          ))}
        </div>
        <button
          onClick={() => (isSaved ? onRemove(article.id) : onSave(article))}
          aria-label={isSaved ? 'あとで読むから削除' : 'あとで読む'}
          className={`text-lg transition-colors shrink-0 ${
            isSaved ? 'text-yellow-300' : 'text-white/40 hover:text-yellow-300'
          }`}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xl font-bold leading-snug hover:underline decoration-white/50"
      >
        {article.title}
      </a>

      <div className="flex items-center justify-between mt-3">
        {time && <span className="text-xs text-blue-200">{time}</span>}
        {article.finalScore > 0 && (
          <span className="text-xs font-bold text-white/60 tabular-nums ml-auto">
            score {Math.round(article.finalScore)}
          </span>
        )}
      </div>
    </article>
  )
}
