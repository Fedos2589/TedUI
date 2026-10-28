// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GridOption, MonthYearGrid } from './MonthYearGrid'

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029]

const years = (selected: number, disabled: number[] = []): GridOption[] =>
  YEARS.map((year) => ({
    value: year,
    label: String(year),
    disabled: disabled.includes(year),
    selected: year === selected,
  }))

const renderGrid = ({
  selected = 2026,
  disabled = [] as number[],
  layout = 'list' as 'list' | 'grid',
  onSelect = vi.fn(),
} = {}) => {
  render(
    <MonthYearGrid
      options={years(selected, disabled)}
      onSelect={onSelect}
      layout={layout}
      aria-label="Select year"
    />,
  )
  return { onSelect }
}

const option = (year: number) =>
  screen.getByRole('option', { name: String(year) })

const press = (key: string) =>
  fireEvent.keyDown(document.activeElement as Element, { key })

describe('MonthYearGrid', () => {
  it('opens on the current value and makes it the only tab stop', () => {
    renderGrid()

    expect(document.activeElement).toBe(option(2026))
    expect(option(2026).tabIndex).toBe(0)
    expect(option(2025).tabIndex).toBe(-1)
  })

  it('walks the list with the arrow keys', () => {
    renderGrid()

    press('ArrowDown')
    expect(document.activeElement).toBe(option(2027))

    press('ArrowUp')
    press('ArrowUp')
    expect(document.activeElement).toBe(option(2025))
  })

  // Nothing can be done on an option that cannot be picked, so the arrows pass
  // over it rather than parking the keyboard there.
  it('steps over options that cannot be picked', () => {
    renderGrid({ disabled: [2027, 2028] })

    press('ArrowDown')

    expect(document.activeElement).toBe(option(2029))
  })

  it('moves by rows in the three-column layout', () => {
    renderGrid({ layout: 'grid' })

    press('ArrowDown')
    expect(document.activeElement).toBe(option(2029))

    press('ArrowLeft')
    expect(document.activeElement).toBe(option(2028))
  })

  it('jumps to the ends with Home and End', () => {
    renderGrid()

    press('End')
    expect(document.activeElement).toBe(option(2029))

    press('Home')
    expect(document.activeElement).toBe(option(2024))
  })

  // The arrows only move the tab stop; picking stays an explicit action.
  it('picks with a click, not by arrowing past', () => {
    const { onSelect } = renderGrid()

    press('ArrowDown')
    expect(onSelect).not.toHaveBeenCalled()

    fireEvent.click(option(2027))
    expect(onSelect).toHaveBeenCalledWith(2027)
  })
})
