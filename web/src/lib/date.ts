export function getTodayJST(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date())
}

export function formatDateJST(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month)}/${parseInt(day)}`
}

export function formatPublishedAt(publishedAt: string | null): string {
  if (!publishedAt) return ''
  const date = new Date(publishedAt)
  // Manually compute JST time to avoid locale inconsistencies in test environments
  const jstOffset = 9 * 60
  const localOffset = date.getTimezoneOffset()
  const jstMs = date.getTime() + (jstOffset + localOffset) * 60 * 1000
  const jst = new Date(jstMs)
  return `${String(jst.getHours()).padStart(2, '0')}:${String(jst.getMinutes()).padStart(2, '0')}`
}
