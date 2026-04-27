import { useState } from 'react'
import { getLaterItems, saveLaterItem, removeLaterItem, isLaterItem } from '../lib/storage'
import type { Article, LaterItem } from '../types/article'

export function useLaterItems() {
  const [laterItems, setLaterItems] = useState<LaterItem[]>(() => getLaterItems())

  function save(article: Article) {
    const item: LaterItem = {
      id: article.id,
      title: article.title,
      url: article.url,
      source: article.source,
      savedAt: new Date().toISOString(),
    }
    setLaterItems(saveLaterItem(item))
  }

  function remove(id: string) {
    setLaterItems(removeLaterItem(id))
  }

  function isSaved(id: string): boolean {
    return isLaterItem(id)
  }

  return { laterItems, save, remove, isSaved }
}
