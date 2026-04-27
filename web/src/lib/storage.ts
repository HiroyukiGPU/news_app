import type { LaterItem } from '../types/article'

const KEY = 'tech-news-later-items'

export function getLaterItems(): LaterItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LaterItem[]) : []
  } catch {
    return []
  }
}

export function saveLaterItem(item: LaterItem): LaterItem[] {
  const current = getLaterItems()
  if (current.some((i) => i.id === item.id)) return current
  const updated = [item, ...current]
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function removeLaterItem(id: string): LaterItem[] {
  const updated = getLaterItems().filter((i) => i.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function isLaterItem(id: string): boolean {
  return getLaterItems().some((i) => i.id === id)
}
