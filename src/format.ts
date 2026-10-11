const parse = (iso: string) => new Date(`${iso}T00:00:00`)

export const formatUsd = (value: number) => `$${value.toFixed(2)}`

export const formatKrw = (value: number) => `₩${value.toLocaleString('en-US')}`

/** "Wed, Oct 21" */
export const formatWeekdayDate = (iso: string) =>
  parse(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

/** "Oct 14" */
export const formatShortDate = (iso: string) =>
  parse(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/** "Sunday, Oct 11, 2026" */
export const formatLongDate = (iso: string) =>
  parse(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })

export const subtractDays = (iso: string, days: number) => {
  const date = parse(iso)
  date.setDate(date.getDate() - days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
