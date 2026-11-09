import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import {
  buildMonthGrid,
  buildYearOptions,
  clampDate,
  isDateDisabled,
  isInsideRange,
  normalizeRange,
} from './calendarModel'

const d = (iso: string) => dayjs(iso)

describe('buildMonthGrid', () => {
  it('pads July 2025 to whole weeks starting on Monday', () => {
    const weeks = buildMonthGrid(d('2025-07-01'), 1)

    expect(weeks).toHaveLength(5)
    expect(weeks[0][0].format('YYYY-MM-DD')).toBe('2025-06-30')
    expect(weeks[4][6].format('YYYY-MM-DD')).toBe('2025-08-03')
  })

  it('shifts the padding when the week starts on Sunday', () => {
    const weeks = buildMonthGrid(d('2025-07-01'), 0)

    expect(weeks[0][0].format('YYYY-MM-DD')).toBe('2025-06-29')
    expect(weeks[0][1].format('YYYY-MM-DD')).toBe('2025-06-30')
  })

  it('needs six rows when a 31-day month opens on a Saturday', () => {
    const weeks = buildMonthGrid(d('2025-03-01'), 1)

    expect(weeks).toHaveLength(6)
    expect(weeks[0][0].format('YYYY-MM-DD')).toBe('2025-02-24')
    expect(weeks[5][6].format('YYYY-MM-DD')).toBe('2025-04-06')
  })

  it('gives every row seven days', () => {
    const weeks = buildMonthGrid(d('2026-02-01'), 1)

    weeks.forEach((week) => expect(week).toHaveLength(7))
  })
})

describe('isDateDisabled', () => {
  it('treats the bounds themselves as allowed', () => {
    expect(
      isDateDisabled(d('2025-07-01'), d('2025-07-01'), d('2025-07-31')),
    ).toBe(false)
    expect(
      isDateDisabled(d('2025-07-31'), d('2025-07-01'), d('2025-07-31')),
    ).toBe(false)
  })

  it('rejects dates outside the bounds', () => {
    expect(
      isDateDisabled(d('2025-06-30'), d('2025-07-01'), d('2025-07-31')),
    ).toBe(true)
    expect(
      isDateDisabled(d('2025-08-01'), d('2025-07-01'), d('2025-07-31')),
    ).toBe(true)
  })

  it('allows anything when no bounds are given', () => {
    expect(isDateDisabled(d('1999-01-01'))).toBe(false)
  })

  it('ignores the time of day on the bound', () => {
    expect(
      isDateDisabled(d('2025-07-31'), undefined, d('2025-07-31T00:00:00')),
    ).toBe(false)
  })
})

describe('clampDate', () => {
  it('pulls a date back to the maximum', () => {
    expect(
      clampDate(d('2025-09-15'), undefined, d('2025-07-31')).format(
        'YYYY-MM-DD',
      ),
    ).toBe('2025-07-31')
  })

  it('pushes a date up to the minimum', () => {
    expect(
      clampDate(d('2025-01-05'), d('2025-07-01'), undefined).format(
        'YYYY-MM-DD',
      ),
    ).toBe('2025-07-01')
  })

  it('leaves a date between the bounds alone', () => {
    expect(
      clampDate(d('2025-07-10'), d('2025-07-01'), d('2025-07-31')).format(
        'YYYY-MM-DD',
      ),
    ).toBe('2025-07-10')
  })
})

describe('normalizeRange', () => {
  it('swaps endpoints picked in reverse order', () => {
    const { from, to } = normalizeRange(d('2025-07-24'), d('2025-07-18'))

    expect(from.format('YYYY-MM-DD')).toBe('2025-07-18')
    expect(to.format('YYYY-MM-DD')).toBe('2025-07-24')
  })

  it('keeps endpoints already in order', () => {
    const { from, to } = normalizeRange(d('2025-07-18'), d('2025-07-24'))

    expect(from.format('YYYY-MM-DD')).toBe('2025-07-18')
    expect(to.format('YYYY-MM-DD')).toBe('2025-07-24')
  })
})

describe('isInsideRange', () => {
  const from = d('2025-07-24')
  const to = d('2025-07-30')

  it('marks the days between the endpoints', () => {
    expect(isInsideRange(d('2025-07-27'), from, to)).toBe(true)
  })

  it('leaves the endpoints out — they render as selected, not as fill', () => {
    expect(isInsideRange(from, from, to)).toBe(false)
    expect(isInsideRange(to, from, to)).toBe(false)
  })

  it('is false while only one endpoint is picked', () => {
    expect(isInsideRange(d('2025-07-27'), from, null)).toBe(false)
  })
})

describe('buildYearOptions', () => {
  it('lists the bounded years inclusively, oldest first', () => {
    expect(buildYearOptions(d('2020-05-10'), d('2023-02-01'))).toEqual([
      2020, 2021, 2022, 2023,
    ])
  })

  it('falls back to a century around the anchor when unbounded', () => {
    const years = buildYearOptions(undefined, undefined, d('2025-07-01'))

    expect(years[0]).toBe(1925)
    expect(years[years.length - 1]).toBe(2125)
  })
})
