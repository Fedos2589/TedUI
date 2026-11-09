import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/** The wire format every consumer stores dates in. */
export const DATE_VALUE_FORMAT = 'YYYY-MM-DD'

/**
 * Strict parse: a half-valid string like `2025-13-45` would otherwise become an
 * Invalid Date that silently poisons every comparison downstream.
 */
export const parseDateValue = (value?: string | null): Dayjs | null => {
  if (!value) return null

  const parsed = dayjs(value, DATE_VALUE_FORMAT, true)

  return parsed.isValid() ? parsed : null
}

export const formatDateValue = (date?: Dayjs | null) =>
  date ? date.format(DATE_VALUE_FORMAT) : ''

/** `month` is dayjs-style: 0 = January. */
export const isMonthDisabled = (
  year: number,
  month: number,
  min?: Dayjs | null,
  max?: Dayjs | null,
) => {
  const start = dayjs().year(year).month(month).startOf('month')

  if (min && start.endOf('month').isBefore(min, 'day')) return true
  if (max && start.isAfter(max, 'day')) return true

  return false
}

export const isYearDisabled = (
  year: number,
  min?: Dayjs | null,
  max?: Dayjs | null,
) => {
  if (min && year < min.year()) return true
  if (max && year > max.year()) return true

  return false
}
