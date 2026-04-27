export type TabId = 'top' | 'all' | 'sources' | 'later'

const TABS: { id: TabId; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'all', label: 'All' },
  { id: 'sources', label: 'Sources' },
  { id: 'later', label: 'Later' },
]

type Props = {
  activeTab: TabId
  onChange: (tab: TabId) => void
  laterCount: number
}

export function Tabs({ activeTab, onChange, laterCount }: Props) {
  return (
    <nav
      role="tablist"
      aria-label="コンテンツタブ"
      className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
    >
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onChange(id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === id
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {label}
          {id === 'later' && laterCount > 0 && (
            <span
              aria-label={`${laterCount}件保存済み`}
              className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 rounded-full"
            >
              {laterCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
