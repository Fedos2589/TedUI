import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { isInPreviewRange, nextRangeSelection } from './rangeSelection'

const d = (iso: string) => dayjs(iso)
const iso = (date: ReturnType<typeof d> | null) =>
  date ? date.format('YYYY-MM-DD') : null

describe('nextRangeSelection', () => {
  it('starts the range on the first pick', () => {
    const next = nextRangeSelection({ from: null, to: null }, d('2025-07-24'))

    expect(iso(next.from)).toBe('2025-07-24')
    expect(next.to).toBeNull()
  })

  it('closes the range on the second pick', () => {
    const next = nextRangeSelection(
      { from: d('2025-07-24'), to: null },
      d('2025-07-30'),
    )

    expect(iso(next.from)).toBe('2025-07-24')
    expect(iso(next.to)).toBe('2025-07-30')
  })

  it('orders the range when the second pick lands earlier', () => {
    const next = nextRangeSelection(
      { from: d('2025-07-24'), to: null },
      d('2025-07-18'),
    )

    expect(iso(next.from)).toBe('2025-07-18')
    expect(iso(next.to)).toBe('2025-07-24')
  })

  it('collapses to a single day when both picks are the same day', () => {
    const next = nextRangeSelection(
      { from: d('2025-07-24'), to: null },
      d('2025-07-24'),
    )

    expect(iso(next.from)).toBe('2025-07-24')
    expect(iso(next.to)).toBe('2025-07-24')
  })

  it('restarts from the new day once a range is complete', () => {
    const next = nextRangeSelection(
      { from: d('2025-07-24'), to: d('2025-07-30') },
      d('2025-08-02'),
    )

    expect(iso(next.from)).toBe('2025-08-02')
    expect(next.to).toBeNull()
  })
})

describe('isInPreviewRange', () => {
  const half = { from: d('2025-07-24'), to: null }

  it('covers the days between the anchor and the pointer', () => {
    expect(isInPreviewRange(d('2025-07-27'), half, d('2025-07-30'))).toBe(true)
  })

  it('covers the day under the pointer, so the strip ends there', () => {
    expect(isInPreviewRange(d('2025-07-30'), half, d('2025-07-30'))).toBe(true)
  })

  it('leaves the anchor out — it renders as selected, not as fill', () => {
    expect(isInPreviewRange(d('2025-07-24'), half, d('2025-07-30'))).toBe(false)
  })

  it('reaches backwards when the pointer is before the anchor', () => {
    expect(isInPreviewRange(d('2025-07-20'), half, d('2025-07-18'))).toBe(true)
    expect(isInPreviewRange(d('2025-07-26'), half, d('2025-07-18'))).toBe(false)
  })

  it('stops outside the span', () => {
    expect(isInPreviewRange(d('2025-07-31'), half, d('2025-07-30'))).toBe(false)
  })

  it('does not preview once both endpoints are picked', () => {
    const full = { from: d('2025-07-24'), to: d('2025-07-30') }

    expect(isInPreviewRange(d('2025-08-05'), full, d('2025-08-10'))).toBe(false)
  })

  // A single-date picker keeps both endpoints on the same day, so it never
  // reaches the half-open state the preview is for.
  it('does not preview without an anchor or a pointer', () => {
    expect(
      isInPreviewRange(
        d('2025-07-27'),
        { from: null, to: null },
        d('2025-07-30'),
      ),
    ).toBe(false)
    expect(isInPreviewRange(d('2025-07-27'), half, null)).toBe(false)
  })
})
