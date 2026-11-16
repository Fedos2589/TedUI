// @vitest-environment happy-dom
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider, toast } from './Toast'

afterEach(() => {
  vi.useRealTimers()
  act(() => toast.remove())
  cleanup()
})

describe('Toast live regions', () => {
  it('announces an error as an alert', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.error('Failed')
    })
    expect((await screen.findByRole('alert')).textContent).toContain('Failed')
  })

  it('announces a warning as an alert', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.warning('Careful')
    })
    expect((await screen.findByRole('alert')).textContent).toContain('Careful')
  })

  it('keeps success polite', async () => {
    render(<ToastProvider />)
    act(() => {
      toast.success('Saved')
    })
    expect((await screen.findByRole('status')).textContent).toContain('Saved')
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('Toast duration', () => {
  // Small steps, each flushed by its own act(): react-hot-toast schedules the
  // next timer from a React effect, so one big jump would skip the chain.
  const advance = (ms: number) => {
    for (let spent = 0; spent < ms; spent += 100) {
      act(() => void vi.advanceTimersByTime(100))
    }
  }

  it('keeps a plain toast for 4s, then removes it', () => {
    vi.useFakeTimers()
    render(<ToastProvider />)
    act(() => {
      toast('Plain')
    })
    advance(3500)
    expect(screen.queryByText('Plain')).not.toBeNull()
    advance(1500) // 4000 + exit animation
    expect(screen.queryByText('Plain')).toBeNull()
  })

  it.each(['error', 'warning'] as const)('keeps %s for 7s', (kind) => {
    vi.useFakeTimers()
    render(<ToastProvider />)
    act(() => {
      toast[kind]('Look')
    })
    advance(6000)
    expect(screen.queryByText('Look')).not.toBeNull()
    advance(2500)
    expect(screen.queryByText('Look')).toBeNull()
  })
})
