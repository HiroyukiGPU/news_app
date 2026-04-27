import { formatDateJST, formatPublishedAt } from '../lib/date'

type Props = {
  date: string
  generatedAt: string | null
  onPrevDay: () => void
  onNextDay: () => void
  isNextDisabled: boolean
}

export function Header({ date, generatedAt, onPrevDay, onNextDay, isNextDisabled }: Props) {
  const time = formatPublishedAt(generatedAt) || null

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tech News</h1>
          {time && (
            <p className="text-xs text-gray-500 dark:text-gray-400">更新 {time}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDay}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="前の日"
          >
            ←
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[60px] text-center">
            {formatDateJST(date)}
          </span>
          <button
            onClick={onNextDay}
            disabled={isNextDisabled}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
            aria-label="次の日"
          >
            →
          </button>
        </div>
      </div>
    </header>
  )
}
