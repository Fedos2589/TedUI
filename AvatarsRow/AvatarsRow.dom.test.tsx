// @vitest-environment happy-dom
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AvatarsRow } from './index'

afterEach(cleanup)

const people = [{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }]

describe('AvatarsRow', () => {
  it('is a named list of its avatars', () => {
    render(<AvatarsRow data={people} />)
    const list = screen.getByRole('list', { name: '{{count}} people' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
  })

  it('makes the +N chip a list item too', () => {
    render(<AvatarsRow data={people} max={2} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(
      within(items[2]).getByRole('img', { name: '{{count}} more' }),
    ).toBeTruthy()
  })
})
