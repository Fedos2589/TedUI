// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReactElement } from 'react'
import { DatePicker } from './DatePicker'

// The subtitle belongs to the mobile sheet; happy-dom opens at 1024px, which
// would give us the desktop popover and no header at all.
;(
  window as unknown as { happyDOM?: { setViewport: (size: object) => void } }
).happyDOM?.setViewport({ width: 390, height: 844 })

const openSheet = (ui: ReactElement) => {
  render(ui)
  fireEvent.click(screen.getByRole('textbox'))
}

describe('DatePicker sheet subtitle', () => {
  it('names only the month when there is no day step', () => {
    openSheet(
      <DatePicker
        mode="single"
        views={['year', 'month']}
        value="2022-06-01"
        onChange={vi.fn()}
      />,
    )

    // Without a day view the sheet opens on the year; the subtitle belongs to
    // the step that commits, so pick one to get there.
    fireEvent.click(screen.getByRole('option', { name: '2022' }))

    expect(screen.getByText('June 2022')).toBeTruthy()
    expect(screen.queryByText(/Wednesday/)).toBeNull()
  })

  it('names the weekday and day when days can be picked', () => {
    openSheet(
      <DatePicker mode="single" value="2022-06-01" onChange={vi.fn()} />,
    )

    expect(screen.getByText('Wednesday, 1 June 2022')).toBeTruthy()
  })
})
