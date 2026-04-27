type Props = {
  message: string
}

export function EmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </div>
  )
}
