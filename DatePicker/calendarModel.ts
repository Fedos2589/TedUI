import dayjs, { Dayjs } from 'dayjs'

/** Days rendered per calendar row — the week, whichever day it starts on. */
const DAYS_IN_WEEK = 7

/** Half-width of the year list offered when the picker has no min/max. */
const UNBOUNDED_YEAR_SPAN = 100

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * The month padded out to whole weeks, so every row has seven cells and the
 * leading/trailing ones belong to the neighbouring months. Row count varies
 * between four and six — the design draws the month, not a fixed box.
 */
export const buildMonthGrid = (
  month: Dayjs,
  weekStart: WeekStart,
): Dayjs[][] => {
  const firstOfMonth = month.startOf('month')
  const lastOfMonth = month.endOf('month').startOf('day')

  const leading = (firstOfMonth.day() - weekStart + DAYS_IN_WEEK) % DAYS_IN_WEEK
  const trailing =
    (weekStart + DAYS_IN_WEEK - 1 - lastOfMonth.day() + DAYS_IN_WEEK) %
    DAYS_IN_WEEK

  const gridStart = firstOfMonth.subtract(leading, 'day')
  const total = leading + lastOfMonth.date() + trailing

  const weeks: Dayjs[][] = []
  for (let offset = 0; offset < total; offset += DAYS_IN_WEEK) {
    weeks.push(
      Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
        gridStart.add(offset + index, 'day'),
      ),
    )
  }

  return weeks
}

export const isDateDisabled = (
  date: Dayjs,
  min?: Dayjs | null,
  max?: Dayjs | null,
) => {
  if (min && date.isBefore(min, 'day')) return true
  if (max && date.isAfter(max, 'day')) return true

  return false
}

export const clampDate = (
  date: Dayjs,
  min?: Dayjs | null,
  max?: Dayjs | null,
) => {
  if (min && date.isBefore(min, 'day')) return min
  if (max && date.isAfter(max, 'day')) return max

  return date
}

export const normalizeRange = (a: Dayjs, b: Dayjs) =>
  a.isAfter(b, 'day') ? { from: b, to: a } : { from: a, to: b }

/**
 * Strictly between the endpoints: the endpoints themselves render as
 * `selected`, and only the days they span get the range fill.
 */
export const isInsideRange = (
  date: Dayjs,
  from?: Dayjs | null,
  to?: Dayjs | null,
) => {
  if (!from || !to) return false

  return date.isAfter(from, 'day') && date.isBefore(to, 'day')
}

export const buildYearOptions = (
  min?: Dayjs | null,
  max?: Dayjs | null,
  anchor: Dayjs = dayjs(),
) => {
  const first = min ? min.year() : anchor.year() - UNBOUNDED_YEAR_SPAN
  const last = max ? max.year() : anchor.year() + UNBOUNDED_YEAR_SPAN

  return Array.from(
    { length: Math.max(last - first + 1, 1) },
    (_, index) => first + index,
  )
}

/**
 * The first day from `start`, walking one day at a time in the direction of
 * `step`, that can actually be picked. Disabled days are stepped over rather
 * than focused — there is nothing to do on one — and a walk that leaves the
 * allowed range gives up instead of running to the guard.
 */
export const firstEnabledDate = (
  start: Dayjs,
  step: 1 | -1,
  min?: Dayjs | null,
  max?: Dayjs | null,
): Dayjs | null => {
  let candidate = start

  // A year is further than any single key press moves.
  for (let guard = 0; guard < 400; guard += 1) {
    if (!isDateDisabled(candidate, min, max)) return candidate
    if (step > 0 && max && candidate.isAfter(max, 'day')) return null
    if (step < 0 && min && candidate.isBefore(min, 'day')) return null

    candidate = candidate.add(step, 'day')
  }

  return null
}
