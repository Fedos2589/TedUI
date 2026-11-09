import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import {
  formatDateValue,
  isMonthDisabled,
  isYearDisabled,
  parseDateValue,
} from './dateValue'

const d = (iso: string) => dayjs(iso)

describe('parseDateValue', () => {
  it('reads the YYYY-MM-DD the app stores', () => {
    expect(parseDateValue('2025-07-24')?.format('YYYY-MM-DD')).toBe(
      '2025-07-24',
    )
  })

  it('returns null for an empty value, which is how a cleared field arrives', () => {
    expect(parseDateValue('')).toBeNull()
    expect(parseDateValue(null)).toBeNull()
    expect(parseDateValue(undefined)).toBeNull()
  })

  it('returns null rather than an Invalid Date for junk', () => {
    expect(parseDateValue('not-a-date')).toBeNull()
    expect(parseDateValue('2025-13-45')).toBeNull()
  })
})

describe('formatDateValue', () => {
  it('writes the stored format', () => {
    expect(formatDateValue(d('2025-07-24'))).toBe('2025-07-24')
  })

  it('writes an empty string when there is nothing selected', () => {
    expect(formatDateValue(null)).toBe('')
  })
})

describe('isMonthDisabled', () => {
  const min = d('2025-03-15')
  const max = d('2025-09-10')

  it('allows the months the bounds fall in, partial though they are', () => {
    expect(isMonthDisabled(2025, 2, min, max)).toBe(false)
    expect(isMonthDisabled(2025, 8, min, max)).toBe(false)
  })

  it('blocks the months fully outside the bounds', () => {
    expect(isMonthDisabled(2025, 1, min, max)).toBe(true)
    expect(isMonthDisabled(2025, 9, min, max)).toBe(true)
  })
})

describe('isYearDisabled', () => {
  it('blocks years outside the bounds and keeps the boundary years', () => {
    const min = d('2020-05-10')
    const max = d('2023-02-01')

    expect(isYearDisabled(2019, min, max)).toBe(true)
    expect(isYearDisabled(2020, min, max)).toBe(false)
    expect(isYearDisabled(2023, min, max)).toBe(false)
    expect(isYearDisabled(2024, min, max)).toBe(true)
  })
})
