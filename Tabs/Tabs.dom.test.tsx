// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tabs } from './index'

describe('Tabs', () => {
  it('names the unread dot for screen readers', () => {
    render(
      <Tabs
        aria-label="Mail"
        value="a"
        onChange={vi.fn()}
        data={[{ label: 'Inbox', value: 'a', dot: true, dotLabel: 'unread' }]}
      />,
    )

    expect(screen.getByRole('tab', { name: 'Inbox unread' })).toBeTruthy()
  })
})
