// @vitest-environment happy-dom
import { act, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { ActionBar } from './ActionBar'

afterEach(() => vi.unstubAllGlobals())

test('rises by the height the keyboard covers, and settles back', () => {
  vi.stubGlobal('innerHeight', 844)
  const viewport = Object.assign(new EventTarget(), {
    height: 844,
    offsetTop: 0,
    scale: 1,
  })
  vi.stubGlobal('visualViewport', viewport)

  render(
    <ActionBar data-testid="bar">
      <button type="submit">Continue</button>
    </ActionBar>,
  )
  const bar = screen.getByTestId('bar')
  expect(bar.style.getPropertyValue('--keyboard-inset')).toBe('0px')
  expect(bar.hasAttribute('data-keyboard-open')).toBe(false)

  viewport.height = 508
  act(() => {
    viewport.dispatchEvent(new Event('resize'))
  })
  expect(bar.style.getPropertyValue('--keyboard-inset')).toBe('336px')
  expect(bar.hasAttribute('data-keyboard-open')).toBe(true)

  viewport.height = 844
  act(() => {
    viewport.dispatchEvent(new Event('resize'))
  })
  expect(bar.style.getPropertyValue('--keyboard-inset')).toBe('0px')
  expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy()
})
