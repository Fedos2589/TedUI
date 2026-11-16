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

describe('ButtonWithTooltip desktop tooltip', () => {
  beforeEach(() => {
    viewport.isMobile = false
  })

  it('closes on Escape but not when the pointer leaves', async () => {
    const onClose = vi.fn()
    render(
      <ButtonWithTooltip
        isOpen
        onClose={onClose}
        tooltipContent="tip"
        modalContent="sheet"
      >
        <button>Info</button>
      </ButtonWithTooltip>,
    )
    const button = screen.getByRole('button', { name: 'Info' })
    button.focus()
    fireEvent.focus(button)

    fireEvent.mouseLeave(button.closest('span') ?? button)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(button, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
