import type { Article } from '../types/article'
import { ArticleCard } from './ArticleCard'
import { EmptyState } from './EmptyState'

type Props = {
  articles: Article[]
  savedIds: Set<string>
  onSave: (article: Article) => void
  onRemove: (id: string) => void
  emptyMessage: string
}

export function ArticleList({ articles, savedIds, onSave, onRemove, emptyMessage }: Props) {
  if (articles.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          isSaved={savedIds.has(article.id)}
          onSave={onSave}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
