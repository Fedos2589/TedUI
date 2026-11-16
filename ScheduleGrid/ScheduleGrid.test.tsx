// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ScheduleGrid } from './ScheduleGrid'

afterEach(cleanup)

const columns = [
  {
    id: 'anna',
    label: 'Anna',
    items: [
      { id: 'b1', startMinute: 600, endMinute: 660, children: 'Haircut' },
    ],
  },
  { id: 'ben', label: 'Ben', items: [] },
]

describe('ScheduleGrid', () => {
  it('reports the column and item of a clicked item', () => {
    const onItemClick = vi.fn()
    render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={480}
        endMinute={1200}
        onItemClick={onItemClick}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Haircut' }))
    expect(onItemClick).toHaveBeenCalledWith('anna', 'b1')
  })

  it('renders items as plain text without onItemClick', () => {
    render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={480}
        endMinute={1200}
      />,
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('Haircut')).toBeTruthy()
  })

  it('names each column by its label', () => {
    render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={480}
        endMinute={1200}
      />,
    )
    expect(screen.getByRole('group', { name: 'Ben' })).toBeTruthy()
  })
})
