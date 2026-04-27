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
    <header className="bg-gray-900 dark:bg-black px-4 py-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tech News</h1>
          <p className="text-xs text-blue-400 font-medium mt-0.5">AI × Tech Daily</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevDay}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="前の日"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-gray-200 min-w-[60px] text-center">
            {formatDateJST(date)}
          </span>
          <button
            onClick={onNextDay}
            disabled={isNextDisabled}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
            aria-label="次の日"
          >
            →
          </button>
        </div>
      </div>
      {time && (
        <p className="text-xs text-gray-500 mt-2">最終更新 {time}</p>
      )}
    </header>
  )
}
