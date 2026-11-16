// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Counter } from './Counter'

describe('Counter', () => {
  it('passes aria props to the dot', () => {
    render(<Counter variant="dot" role="img" aria-label="3 new" />)

    expect(screen.getByRole('img', { name: '3 new' })).toBeTruthy()
  })

  it('passes aria props to the number', () => {
    render(<Counter count={3} aria-label="3 new" role="img" />)

    expect(screen.getByRole('img', { name: '3 new' })).toBeTruthy()
  })
})
