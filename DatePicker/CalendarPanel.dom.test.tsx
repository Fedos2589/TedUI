// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import { CalendarPanel, CalendarPanelProps } from './CalendarPanel'

const d = (iso: string) => dayjs(iso)

const renderPanel = (props: Partial<CalendarPanelProps> = {}) => {
  const onViewMonthChange = vi.fn()
  const onDayPick = vi.fn()

  render(
    <CalendarPanel
      view="day"
      views={['year', 'month', 'day']}
      viewMonth={d('2025-07-01')}
      selection={{ from: d('2025-07-15'), to: d('2025-07-15') }}
      min={null}
      max={null}
      layout="desktop"
      onViewChange={vi.fn()}
      onViewMonthChange={onViewMonthChange}
      onDayPick={onDayPick}
      onMonthPick={vi.fn()}
      onYearPick={vi.fn()}
      {...props}
    />,
  )

  return { onViewMonthChange, onDayPick }
}

const day = (iso: string) =>
  document.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)!

// happy-dom moves `document.activeElement` on a programmatic `.focus()` but
// doesn't dispatch the `focusin` React listens to, so the event goes with it.
const focusDay = (iso: string) => {
  const cell = day(iso)
  cell.focus()
  fireEvent.focus(cell)
}

const press = (key: string, init: object = {}) =>
  fireEvent.keyDown(document.activeElement as Element, { key, ...init })

describe('CalendarPanel keyboard', () => {
  // 42 buttons behind 42 tab stops is what the roving tab index exists to
  // avoid: Tab reaches the month once, the arrows do the rest.
  it('gives the month a single tab stop, on the picked day', () => {
    renderPanel()

    const stops = screen
      .getByRole('grid')
      .querySelectorAll('button:not([tabindex="-1"])')

    expect(stops).toHaveLength(1)
    expect(stops[0]).toBe(day('2025-07-15'))
  })

  it('falls back to today when nothing is picked in this month', () => {
    vi.setSystemTime(new Date('2025-07-09T12:00:00Z'))
    renderPanel({ selection: { from: null, to: null } })

    expect(day('2025-07-09').tabIndex).toBe(0)
    vi.useRealTimers()
  })

  it('moves a day with the side arrows and a week with the vertical ones', () => {
    renderPanel()
    focusDay('2025-07-15')

    press('ArrowRight')
    expect(document.activeElement).toBe(day('2025-07-16'))

    press('ArrowDown')
    expect(document.activeElement).toBe(day('2025-07-23'))

    press('ArrowUp')
    press('ArrowLeft')
    expect(document.activeElement).toBe(day('2025-07-15'))
  })

  it('reaches the ends of the week with Home and End', () => {
    renderPanel()
    focusDay('2025-07-16')

    press('Home')
    expect(document.activeElement).toBe(day('2025-07-14'))

    press('End')
    expect(document.activeElement).toBe(day('2025-07-20'))
  })

  // July 2025 starts on a Tuesday, so the grid's first cell is 30 June: moving
  // onto it has to turn the page, not just move focus into a borrowed day.
  it('turns the page when a move leaves the month', () => {
    const { onViewMonthChange } = renderPanel()
    focusDay('2025-07-01')

    press('ArrowLeft')

    expect(onViewMonthChange).toHaveBeenCalledTimes(1)
    expect(onViewMonthChange.mock.calls[0][0].format('YYYY-MM-DD')).toBe(
      '2025-06-30',
    )
  })

  it('pages by month, and by year with Shift', () => {
    const { onViewMonthChange } = renderPanel()
    focusDay('2025-07-15')

    press('PageDown')
    expect(onViewMonthChange.mock.calls[0][0].format('YYYY-MM-DD')).toBe(
      '2025-08-15',
    )

    press('PageUp', { shiftKey: true })
    expect(onViewMonthChange.mock.calls[1][0].format('YYYY-MM-DD')).toBe(
      '2024-07-15',
    )
  })

  it('steps over days that cannot be picked', () => {
    renderPanel({ max: d('2025-07-17') })
    focusDay('2025-07-17')

    press('ArrowRight')

    // 18 July is past `max`, and so is everything after it: the move is refused
    // rather than parking the keyboard on a day nothing can be done with.
    expect(document.activeElement).toBe(day('2025-07-17'))
  })

  it('leaves Enter to the button underneath', () => {
    const { onDayPick } = renderPanel()
    focusDay('2025-07-15')

    fireEvent.click(day('2025-07-16'))

    expect(onDayPick).toHaveBeenCalledTimes(1)
    expect(onDayPick.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2025-07-16')
  })
})
