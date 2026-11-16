// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IconButton } from './IconButton'

afterEach(cleanup)

describe('IconButton loading', () => {
  it('stays focusable and announces busy instead of disabling', () => {
    render(
      <IconButton loading aria-label="Save">
        x
      </IconButton>,
    )
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.hasAttribute('disabled')).toBe(false)
    expect(button.getAttribute('aria-disabled')).toBe('true')
    expect(button.getAttribute('aria-busy')).toBe('true')
  })

  it('does not call onClick while loading', () => {
    const onClick = vi.fn()
    render(
      <IconButton loading aria-label="Save" onClick={onClick}>
        x
      </IconButton>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick when not loading', () => {
    const onClick = vi.fn()
    render(
      <IconButton aria-label="Save" onClick={onClick}>
        x
      </IconButton>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps focus when loading starts', () => {
    const { rerender } = render(<IconButton aria-label="Save">x</IconButton>)
    const button = screen.getByRole('button', { name: 'Save' })
    button.focus()
    fireEvent.focus(button)
    rerender(
      <IconButton loading aria-label="Save">
        x
      </IconButton>,
    )
    expect(document.activeElement).toBe(button)
  })
})
