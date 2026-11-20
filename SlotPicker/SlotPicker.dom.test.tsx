// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SlotPicker, type SlotPickerProps } from './SlotPicker'

afterEach(cleanup)

const days = [
  { id: 'd1', weekday: 'Mon', number: '1', today: true },
  { id: 'd2', weekday: 'Tue', number: '2' },
  { id: 'd3', weekday: 'Wed', number: '3', empty: true },
]
const slots = [
  { id: 's1', label: '10:00' },
  { id: 's2', label: '11:00', disabled: true },
  { id: 's3', label: '12:00', hint: 'free 3 of 10' },
]

const setup = (props: Partial<SlotPickerProps> = {}) => {
  const onDayChange = vi.fn()
  const onChange = vi.fn()
  render(
    <SlotPicker
      days={days}
      day="d1"
      onDayChange={onDayChange}
      slots={slots}
      value="s1"
      onChange={onChange}
      emptyText="Nothing free"
      daysLabel="Days"
      slotsLabel="Times"
      {...props}
    />,
  )
  return { onDayChange, onChange }
}

describe('SlotPicker', () => {
  it('exposes days and times as radios, one checked each', () => {
    setup()
    const dayRadios = screen.getAllByRole('radio', { name: /Mon|Tue|Wed/ })
    expect(dayRadios.map((r) => r.getAttribute('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(
      screen.getByRole('radio', { name: /10:00/ }).getAttribute('aria-checked'),
    ).toBe('true')
    expect(
      screen.getByRole('radio', { name: /12:00.*free 3 of 10/ }),
    ).toBeTruthy()
  })

  it('arrow keys move between days and select them', () => {
    const { onDayChange } = setup()
    const group = screen.getByRole('radiogroup', { name: 'Days' })
    const first = screen.getAllByRole('radio', { name: /Mon/ })[0]
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(onDayChange).toHaveBeenCalledWith('d2')
    expect(group.contains(document.activeElement)).toBe(true)
  })

  it('arrow keys skip a disabled time', () => {
    const { onChange } = setup()
    const first = screen.getByRole('radio', { name: /10:00/ })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('s3')
  })

  it('a disabled time cannot be picked', () => {
    const { onChange } = setup()
    fireEvent.click(screen.getByRole('radio', { name: /11:00/ }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('only the checked option is in the tab order', () => {
    setup()
    expect(screen.getByRole('radio', { name: /10:00/ }).tabIndex).toBe(0)
    expect(screen.getByRole('radio', { name: /12:00/ }).tabIndex).toBe(-1)
  })

  it('shows the empty text and keeps an empty day selectable', () => {
    const { onDayChange } = setup({ day: 'd3', slots: [], value: null })
    expect(screen.getByText('Nothing free')).toBeTruthy()
    fireEvent.click(screen.getAllByRole('radio', { name: /Tue/ })[0])
    expect(onDayChange).toHaveBeenCalledWith('d2')
  })
})
