// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { TimePicker } from './TimePicker'

afterEach(cleanup)

test('shows the value as HH:mm and hands the native step and bounds over in the units the input wants', () => {
  render(
    <TimePicker
      aria-label="Start"
      value={540}
      onChange={vi.fn()}
      step={15}
      min={480}
      max={1200}
    />,
  )
  const input = screen.getByLabelText('Start') as HTMLInputElement
  expect(input.type).toBe('time')
  expect(input.value).toBe('09:00')
  expect(input.getAttribute('step')).toBe('900')
  expect(input.getAttribute('min')).toBe('08:00')
  expect(input.getAttribute('max')).toBe('20:00')
})

test('reports minutes after midnight, and null when the field is cleared', () => {
  const onChange = vi.fn()
  render(<TimePicker aria-label="Start" value={540} onChange={onChange} />)
  const input = screen.getByLabelText('Start')

  fireEvent.change(input, { target: { value: '09:30' } })
  expect(onChange).toHaveBeenLastCalledWith(570)

  fireEvent.change(input, { target: { value: '' } })
  expect(onChange).toHaveBeenLastCalledWith(null)
})
