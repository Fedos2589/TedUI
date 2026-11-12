// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'
import en from '../i18n/locales/en.json'

// No i18n instance is initialised here, so react-i18next echoes the key back.
const CANCEL = 'common.button.cancel'

const setup = (
  props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {},
) => {
  const onConfirm = vi.fn()
  const onClose = vi.fn()
  const { unmount } = render(
    <ConfirmDialog
      isVisible
      title="Delete this date?"
      confirmLabel="Delete"
      onConfirm={onConfirm}
      onClose={onClose}
      {...props}
    >
      Fri, May 15
    </ConfirmDialog>,
  )
  return { onConfirm, onClose, unmount }
}

describe('ConfirmDialog', () => {
  // The echo above proves nothing about the key being real: check it exists.
  it('asks for a cancel key that the ui-kit locale has', () => {
    expect(en.common.button.cancel).toBe('Cancel')
  })

  it('names the dialog by its title and shows what is asked about', () => {
    setup()

    expect(
      screen.getByRole('dialog', { name: 'Delete this date?' }),
    ).toBeTruthy()
    expect(screen.getByText('Fri, May 15')).toBeTruthy()
  })

  it('confirms only through the confirm button', () => {
    const { onConfirm, onClose } = setup()
    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('cancels with the translated cancel button, or the given label', () => {
    const { onConfirm, onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: CANCEL }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('takes its own cancel label', () => {
    setup({ cancelLabel: 'Keep it' })

    expect(screen.getByRole('button', { name: 'Keep it' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: CANCEL })).toBeNull()
  })

  it('red scheme paints the confirm button red, black by default', () => {
    const first = setup({ colorScheme: 'red' })
    const red = screen.getByRole('button', { name: 'Delete' }).className

    first.unmount()
    setup()
    const black = screen.getByRole('button', { name: 'Delete' }).className

    expect(red).not.toBe(black)
  })

  it('shows a busy confirm button while it works', () => {
    setup({ loading: true })

    expect(
      screen.getByRole('button', { name: 'Delete' }).getAttribute('aria-busy'),
    ).toBe('true')
  })
})
