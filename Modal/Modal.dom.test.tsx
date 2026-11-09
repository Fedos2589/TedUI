// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Modal } from './Modal'

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
