const MINUTES_IN_DAY = 24 * 60

const pad = (n: number) => String(n).padStart(2, '0')

export function minutesToTime(minutes: number | null | undefined): string {
  if (
    minutes == null ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes >= MINUTES_IN_DAY
  ) {
    return ''
  }
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
}

// A browser may append seconds ("09:30:00") when `step` is under a minute.
export function timeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(time)
  if (!match) return null
  const hours = Number(match[1])
  const mins = Number(match[2])
  if (hours > 23 || mins > 59) return null
  return hours * 60 + mins
}
