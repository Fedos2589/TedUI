// @vitest-environment happy-dom
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ToastProvider, toast } from './Toast'

afterEach(() => {
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
