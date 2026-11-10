// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { useKeyboardInset } from './useKeyboardInset'

// A stand-in for window.visualViewport: iOS Safari keeps the layout viewport
// (innerHeight) when the keyboard opens and shrinks only the visual one.
function fakeVisualViewport(height: number, offsetTop = 0, scale = 1) {
  const viewport = Object.assign(new EventTarget(), {
    height,
    offsetTop,
    scale,
  })
  vi.stubGlobal('visualViewport', viewport)
  return {
    set(next: Partial<{ height: number; offsetTop: number; scale: number }>) {
      Object.assign(viewport, next)
      act(() => {
        viewport.dispatchEvent(new Event('resize'))
      })
    },
  }
}

afterEach(() => vi.unstubAllGlobals())

test('is 0 while no keyboard covers the page', () => {
  vi.stubGlobal('innerHeight', 844)
  fakeVisualViewport(844)

  const { result } = renderHook(() => useKeyboardInset())

  expect(result.current).toBe(0)
})

test('is the height the keyboard covers, and follows it', () => {
  vi.stubGlobal('innerHeight', 844)
  const viewport = fakeVisualViewport(844)
  const { result } = renderHook(() => useKeyboardInset())

  viewport.set({ height: 508 })
  expect(result.current).toBe(336)

  // iOS scrolls the visual viewport down to the focused field.
  viewport.set({ offsetTop: 120 })
  expect(result.current).toBe(216)

  viewport.set({ height: 844, offsetTop: 0 })
  expect(result.current).toBe(0)
})

test('a pinch zoom is not a keyboard', () => {
  vi.stubGlobal('innerHeight', 844)
  const viewport = fakeVisualViewport(844)
  const { result } = renderHook(() => useKeyboardInset())

  viewport.set({ height: 422, scale: 2 })

  expect(result.current).toBe(0)
})

test('is 0 where the browser has no visualViewport', () => {
  vi.stubGlobal('visualViewport', undefined)

  const { result } = renderHook(() => useKeyboardInset())

  expect(result.current).toBe(0)
})
