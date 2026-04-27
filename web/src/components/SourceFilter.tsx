type Props = {
  sources: string[]
  activeSource: string | null
  onChange: (source: string | null) => void
}

export function SourceFilter({ sources, activeSource, onChange }: Props) {
  return (
    <div className="px-4 py-3 flex gap-2 overflow-x-auto">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          activeSource === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
        }`}
      >
        すべて
      </button>
      {sources.map((src) => (
        <button
          key={src}
          onClick={() => onChange(src)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeSource === src
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
        >
          {src}
        </button>
      ))}
    </div>
  )
}
