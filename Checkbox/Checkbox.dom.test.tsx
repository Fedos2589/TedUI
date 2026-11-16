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
})
