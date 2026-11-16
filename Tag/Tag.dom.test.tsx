// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

afterEach(cleanup)

describe('Tag split (clickable and removable)', () => {
  it('puts native props on the body button, not the wrapper', () => {
    render(
      <Tag
        label="Tag"
        onClick={vi.fn()}
        onRemove={vi.fn()}
        aria-describedby="x"
        data-testid="tag"
      />,
    )
    const body = screen.getByRole('button', { name: 'Tag' })
    expect(body.getAttribute('aria-describedby')).toBe('x')
    expect(screen.getByTestId('tag')).toBe(body)
  })
})
