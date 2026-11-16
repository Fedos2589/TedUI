// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRef, useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

// No i18n instance is initialised here, so react-i18next echoes the key back —
// which is all these assertions need to tell the two controls apart.
const CLOSE = 'common.action.close'
const BACK = 'common.action.back'

describe('Modal header controls', () => {
  it('renders close and back as buttons carrying their icon', () => {
    render(
      <Modal isVisible title="Select dates" onClose={vi.fn()} onBack={vi.fn()}>
        body
      </Modal>,
    )

    for (const name of [CLOSE, BACK]) {
      const control = screen.getByRole('button', { name })
      expect(control.tagName).toBe('BUTTON')
      expect(control.querySelector('svg')).not.toBeNull()
    }
  })

  it('closes through the close control', () => {
    const onClose = vi.fn()
    render(
      <Modal isVisible title="Select dates" onClose={onClose}>
        body
      </Modal>,
    )

    fireEvent.click(screen.getByRole('button', { name: CLOSE }))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows the subtitle under the title', () => {
    render(
      <Modal isVisible title="Select dates" subtitle="24 – 31 July, 7 days">
        body
      </Modal>,
    )

    expect(screen.getByText('24 – 31 July, 7 days')).toBeTruthy()
  })
})

describe('Modal semantics', () => {
  it('is a modal dialog named by an h2 title', () => {
    render(
      <Modal isVisible title="Select dates">
        body
      </Modal>,
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Select dates' }),
    ).toBeTruthy()
    const dialog = screen.getByRole('dialog', { name: 'Select dates' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('without a title the dialog takes aria-label and has no heading', () => {
    render(
      <Modal isVisible aria-label="Pick">
        body
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Pick' })).toBeTruthy()
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('describes the dialog by the subtitle only, not by its content', () => {
    const { rerender } = render(
      <Modal isVisible title="T" subtitle="Summary">
        <input aria-label="x" />
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    const id = dialog.getAttribute('aria-describedby')
    expect(document.getElementById(id!)?.textContent).toBe('Summary')

    rerender(
      <Modal isVisible title="T">
        <input aria-label="x" />
      </Modal>,
    )
    expect(
      screen.getByRole('dialog').getAttribute('aria-describedby'),
    ).toBeNull()
  })
})

describe('Modal focus return', () => {
  const Opener = ({ withRef }: { withRef: boolean }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLButtonElement>(null)
    return (
      <>
        <Button ref={ref} onClick={() => setOpen(true)}>
          Open
        </Button>
        <Modal
          isVisible={open}
          title="T"
          onClose={() => setOpen(false)}
          finalFocus={withRef ? ref : undefined}
        >
          body
        </Modal>
      </>
    )
  }

  it('returns focus to the opener after a pointer open (Button blurs itself)', async () => {
    render(<Opener withRef />)
    const button = screen.getByRole('button', { name: 'Open' })
    button.focus()
    fireEvent.pointerUp(button)
    fireEvent.click(button)

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    await waitFor(() => expect(document.activeElement).toBe(button))
  })

  it('still returns focus after a keyboard open without finalFocus', async () => {
    render(<Opener withRef={false} />)
    const button = screen.getByRole('button', { name: 'Open' })
    button.focus()
    fireEvent.focus(button)
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.click(button)

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    await waitFor(() => expect(document.activeElement).toBe(button))
  })
})
