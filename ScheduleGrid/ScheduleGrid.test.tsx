// @vitest-environment happy-dom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
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
    fireEvent.click(screen.getByRole('button', { name: /Haircut/ }))
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

  it('announces the time of an item together with its text', () => {
    render(
      <ScheduleGrid
        aria-label="Day"
        columns={[
          {
            id: 'anna',
            label: 'Anna',
            items: [
              {
                id: 'late',
                startMinute: 1380,
                endMinute: 1440,
                children: 'Late',
              },
            ],
          },
        ]}
        startMinute={480}
        endMinute={1440}
        onItemClick={vi.fn()}
      />,
    )
    expect(
      screen.getByRole('button', { name: '23:00–24:00 Late' }),
    ).toBeTruthy()
  })

  it('reports the snapped minute of a click on empty space, not of a click on an item', () => {
    const onEmptyClick = vi.fn()
    const { container } = render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={480}
        endMinute={1200}
        onItemClick={vi.fn()}
        onEmptyClick={onEmptyClick}
      />,
    )
    const body = container.querySelector(
      '[role="group"][aria-labelledby] > div:last-child',
    )!
    body.getBoundingClientRect = () => ({ top: 100, height: 720 }) as DOMRect
    // 180px of 720px = 1/4 of 12h → 11:00
    fireEvent.click(body, { clientY: 280 })
    expect(onEmptyClick).toHaveBeenCalledWith('anna', 660)

    onEmptyClick.mockClear()
    fireEvent.click(screen.getByRole('button', { name: /Haircut/ }))
    expect(onEmptyClick).not.toHaveBeenCalled()
  })

  it('passes native div props through', () => {
    render(
      <ScheduleGrid
        aria-label="Day"
        data-testid="grid"
        columns={columns}
        startMinute={480}
        endMinute={1200}
      />,
    )
    expect(screen.getByTestId('grid').getAttribute('aria-label')).toBe('Day')
  })

  it('keeps a usable height when the range is empty', () => {
    const { container } = render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={0}
        endMinute={0}
      />,
    )
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/)
    const inner = container.querySelector<HTMLElement>('[style]')!
    expect(inner.style.getPropertyValue('--schedule-grid-hours')).toBe('1')
  })

  it('lists the items of a column as a list, so a screen reader counts them', () => {
    render(
      <ScheduleGrid
        aria-label="Day"
        columns={columns}
        startMinute={480}
        endMinute={1200}
        onItemClick={vi.fn()}
      />,
    )
    const list = within(screen.getByRole('group', { name: 'Anna' })).getByRole(
      'list',
    )
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
  })
})
