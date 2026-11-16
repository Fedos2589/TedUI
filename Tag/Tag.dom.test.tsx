// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

afterEach(cleanup)

describe('Tag split (clickable and removable)', () => {
  it('puts accessibility props on the body button', () => {
    render(
      <Tag
        label="Tag"
        onClick={vi.fn()}
        onRemove={vi.fn()}
        aria-describedby="x"
      />,
    )
    expect(
      screen
        .getByRole('button', { name: 'Tag' })
        .getAttribute('aria-describedby'),
    ).toBe('x')
  })

  it('keeps id, style and data-* on the root, as before', () => {
    render(
      <Tag
        label="Tag"
        onClick={vi.fn()}
        onRemove={vi.fn()}
        id="t"
        style={{ width: 120 }}
        data-testid="tag"
      />,
    )
    const root = screen.getByTestId('tag')
    expect(root).not.toBe(screen.getByRole('button', { name: 'Tag' }))
    expect(root.id).toBe('t')
    expect(root.style.width).toBe('120px')
  })
})
