// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TagSelect } from './TagSelect'

afterEach(cleanup)

const options = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B', disabled: true },
]

describe('TagSelect', () => {
  it('exposes options as toggle buttons', () => {
    render(<TagSelect options={options} value={[]} onChange={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: 'A', pressed: false }),
    ).toBeTruthy()
  })

  it('toggles once per click, with no extra key handling on the button', () => {
    const onChange = vi.fn()
    render(<TagSelect options={options} value={[]} onChange={onChange} />)
    const a = screen.getByRole('button', { name: 'A' })
    expect(a.tagName).toBe('BUTTON')
    expect(a.hasAttribute('role')).toBe(false)
    expect(a.hasAttribute('tabindex')).toBe(false)
    fireEvent.keyDown(a, { key: ' ' })
    fireEvent.keyUp(a, { key: ' ' })
    expect(onChange).not.toHaveBeenCalled() // the click a real Space press makes is the browser's job
    fireEvent.click(a)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith([1])
  })

  it('does not toggle a disabled option', () => {
    const onChange = vi.fn()
    render(<TagSelect options={options} value={[]} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
