type Props = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        ニュースデータを読み込めませんでした。
        <br />
        日付を変えるか、時間を置いて再読み込みしてください。
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
      >
        再読み込み
      </button>
    </div>
  )
}
