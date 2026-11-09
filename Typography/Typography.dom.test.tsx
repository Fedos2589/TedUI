// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Typography } from './Typography'

describe('Typography', () => {
  it('renders a span by default and the requested tag with component', () => {
    render(
      <>
        <Typography>plain</Typography>
        <Typography component="h1">title</Typography>
      </>,
    )

    expect(screen.getByText('plain').tagName).toBe('SPAN')
    expect(
      screen.getByRole('heading', { level: 1, name: 'title' }),
    ).toBeTruthy()
  })

  it('keeps the caller class and native props, and sets no inline style', () => {
    const layoutClass = 'hint'
    render(
      <Typography
        variant="t3"
        className={layoutClass}
        id="hint-id"
        aria-live="polite"
      >
        hint
      </Typography>,
    )

    const text = screen.getByText('hint')
    expect(text.classList.contains(layoutClass)).toBe(true)
    expect(text.id).toBe('hint-id')
    expect(text.getAttribute('aria-live')).toBe('polite')
    expect(text.getAttribute('style')).toBeNull()
  })

  it('colors by token through a class, never an inline style', () => {
    render(<Typography color="grey-500">token</Typography>)

    const text = screen.getByText('token')
    expect(text.className).toMatch(/color-grey-500/)
    expect(text.getAttribute('style')).toBeNull()
  })

  it('rejects colors that are not token names at compile time', () => {
    render(
      <>
        {/* @ts-expect-error -- the old MUI path form is gone */}
        <Typography color="greyscale.500">path</Typography>
        {/* @ts-expect-error -- raw colors bypass the palette */}
        <Typography color="#ff0000">hex</Typography>
      </>,
    )

    // The check is the two @ts-expect-error lines above (run by typecheck).
    expect(screen.getByText('hex')).toBeTruthy()
  })
})
