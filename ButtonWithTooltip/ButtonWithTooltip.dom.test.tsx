// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { Button } from '../Button'
import { ButtonWithTooltip } from './ButtonWithTooltip'

vi.mock('../hooks/useBreakpoints', () => ({
  default: () => ({ isMobile: true, isDesktop: false }),
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
