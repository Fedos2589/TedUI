// @vitest-environment happy-dom
import { beforeAll, describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn()
      disconnect = vi.fn()
    },
  )
})

describe('ProgressBar name', () => {
  it('falls back to a translated name', () => {
    render(<ProgressBar value={2} max={5} />)

    expect(
      screen.getByRole('progressbar', { name: 'progressBar.label' }),
    ).toBeTruthy()
  })

  it('prefers an explicit aria-label', () => {
    render(<ProgressBar value={2} max={5} aria-label="Upload" />)

    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeTruthy()
  })

  it('is named by its caption', () => {
    render(<ProgressBar value={2} max={5} caption="2 of 5" />)

    expect(screen.getByRole('progressbar', { name: '2 of 5' })).toBeTruthy()
  })
})
