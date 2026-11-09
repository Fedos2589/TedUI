import { Dayjs } from 'dayjs'
import { normalizeRange } from './calendarModel'

export interface DateRangeSelection {
  from: Dayjs | null
  to: Dayjs | null
}

/**
 * Picks alternate between opening a range and closing it: a pick on a complete
 * range starts a new one rather than stretching the old, which is what makes
 * "I meant a different week" a single tap instead of a clear-then-retry.
 */
export const nextRangeSelection = (
  current: DateRangeSelection,
  picked: Dayjs,
): DateRangeSelection => {
  if (!current.from || current.to) return { from: picked, to: null }

  return normalizeRange(current.from, picked)
}

/**
 * Days the range would cover if the user committed at `hovered`. Only a
 * half-open selection previews: a complete range already draws its own fill,
 * and a single-date picker never holds one endpoint without the other. The
 * committed endpoint is left out — it renders as selected, not as fill.
 */
export const isInPreviewRange = (
  date: Dayjs,
  current: DateRangeSelection,
  hovered: Dayjs | null,
) => {
  if (!current.from || current.to || !hovered) return false
  if (date.isSame(current.from, 'day')) return false

  const { from, to } = normalizeRange(current.from, hovered)

  return !date.isBefore(from, 'day') && !date.isAfter(to, 'day')
}
