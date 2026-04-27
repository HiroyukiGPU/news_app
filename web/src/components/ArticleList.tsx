import type { Article } from '../types/article'
import { ArticleCard } from './ArticleCard'
import { FeaturedCard } from './FeaturedCard'
import { EmptyState } from './EmptyState'

type Props = {
  articles: Article[]
  savedIds: Set<string>
  onSave: (article: Article) => void
  onRemove: (id: string) => void
  emptyMessage: string
  showFeatured?: boolean
}

export function ArticleList({ articles, savedIds, onSave, onRemove, emptyMessage, showFeatured = false }: Props) {
  if (articles.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  if (showFeatured && articles.length >= 2) {
    const [first, ...rest] = articles
    return (
      <div className="px-4 py-3 flex flex-col gap-3">
        <FeaturedCard
          article={first}
          isSaved={savedIds.has(first.id)}
          onSave={onSave}
          onRemove={onRemove}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isSaved={savedIds.has(article.id)}
              onSave={onSave}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
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
