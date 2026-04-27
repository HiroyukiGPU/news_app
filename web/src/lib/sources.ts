export type SourceMeta = { emoji: string; color: string }

export const SOURCE_META: Record<string, SourceMeta> = {
  Zenn: { emoji: '📘', color: 'text-blue-600 dark:text-blue-400' },
  Qiita: { emoji: '📗', color: 'text-green-600 dark:text-green-400' },
  'はてなブックマーク': { emoji: '🔖', color: 'text-red-600 dark:text-red-400' },
  'Hacker News': { emoji: '🟠', color: 'text-orange-600 dark:text-orange-400' },
  'dev.to': { emoji: '💻', color: 'text-purple-600 dark:text-purple-400' },
  'Hugging Face': { emoji: '🤗', color: 'text-yellow-600 dark:text-yellow-400' },
}

export function getSourceMeta(source: string): SourceMeta {
  return SOURCE_META[source] ?? { emoji: '📄', color: 'text-gray-600 dark:text-gray-400' }
}
