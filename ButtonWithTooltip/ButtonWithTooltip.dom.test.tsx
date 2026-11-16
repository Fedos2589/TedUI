// @vitest-environment happy-dom
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { Button } from '../Button'
import { ButtonWithTooltip } from './ButtonWithTooltip'

const viewport = vi.hoisted(() => ({ isMobile: true }))

vi.mock('../hooks/useBreakpoints', () => ({
  default: () => ({
    isMobile: viewport.isMobile,
    isDesktop: !viewport.isMobile,
  }),
}))

const Host = () => {
  const [open, setOpen] = useState(false)
  return (
    <ButtonWithTooltip
      isOpen={open}
      onToggle={() => setOpen((v) => !v)}
      onClose={() => setOpen(false)}
      tooltipContent="tip"
      modalContent="sheet"
      modalTitle="Info"
    >
      <Button>Info</Button>
    </ButtonWithTooltip>
  )
}

describe('ButtonWithTooltip mobile sheet', () => {
  beforeEach(() => {
    viewport.isMobile = true
  })

  it('returns focus to its trigger after a pointer open', async () => {
    render(<Host />)
    const trigger = screen.getByRole('button', { name: 'Info' })
    trigger.focus()
    fireEvent.pointerUp(trigger)
    fireEvent.click(trigger)

    fireEvent.keyDown(await screen.findByRole('dialog'), { key: 'Escape' })

    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })
})

describe('ButtonWithTooltip desktop popover', () => {
  beforeEach(() => {
    viewport.isMobile = false
  })

  it('is a named dialog with focus inside, not a tooltip', async () => {
    render(
      <ButtonWithTooltip
        isOpen
        tooltipContent={<button>Inside</button>}
        modalContent="sheet"
        modalTitle="Info"
      >
        <button>Info</button>
      </ButtonWithTooltip>,
    )
    const dialog = await screen.findByRole('dialog', { name: 'Info' })
    expect(screen.queryByRole('tooltip')).toBeNull()
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    )
  })

  it('closes on Escape, then returns focus to the trigger', async () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <ButtonWithTooltip
        isOpen
        onClose={onClose}
        tooltipContent={<button>Inside</button>}
        modalContent="sheet"
        modalTitle="Info"
      >
        <button>Info</button>
      </ButtonWithTooltip>,
    )
    const dialog = await screen.findByRole('dialog', { name: 'Info' })
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    rerender(
      <ButtonWithTooltip
        isOpen={false}
        onClose={onClose}
        tooltipContent={<button>Inside</button>}
        modalContent="sheet"
        modalTitle="Info"
      >
        <button>Info</button>
      </ButtonWithTooltip>,
    )
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('button', { name: 'Info' }),
      ),
    )
  })

  it('closes through onToggle when there is no onClose', async () => {
    const onToggle = vi.fn()
    render(
      <ButtonWithTooltip
        isOpen
        onToggle={onToggle}
        tooltipContent="tip"
        modalContent="sheet"
        modalTitle="Info"
      >
        <button>Info</button>
      </ButtonWithTooltip>,
    )
    fireEvent.keyDown(await screen.findByRole('dialog'), { key: 'Escape' })
    await waitFor(() => expect(onToggle).toHaveBeenCalledTimes(1))
  })
})
