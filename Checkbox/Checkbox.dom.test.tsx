// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Checkbox } from './index'

describe('Checkbox hint', () => {
  it('describes the checkbox with its hint', () => {
    render(<Checkbox label="Terms" hint="Read them" />)

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' })
    const id = checkbox.getAttribute('aria-describedby')

    expect(id).toBeTruthy()
    expect(document.getElementById(id!)?.textContent).toBe('Read them')
  })

  it('has no description without a hint', () => {
    render(<Checkbox label="Terms" />)

    expect(
      screen.getByRole('checkbox').getAttribute('aria-describedby'),
    ).toBeNull()
  })

  it("keeps the consumer's own description next to the hint", () => {
    render(
      <>
        <span id="err">Required</span>
        <Checkbox label="Terms" hint="Read them" aria-describedby="err" />
      </>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' })
    const ids = checkbox.getAttribute('aria-describedby')!.split(' ')

    expect(ids).toHaveLength(2)
    expect(ids).toContain('err')
  })

  it('names the hint button by its action, not by the hint text', () => {
    render(<Checkbox label="Terms" hint="Read them" />)

    const button = screen.getByRole('button', {
      name: 'common.action.more_info',
    })
    const id = button.getAttribute('aria-describedby')

    expect(document.getElementById(id!)?.textContent).toBe('Read them')
  })
})
