import type { Meta, StoryObj } from '@storybook/react'
import { ScheduleGrid, type ScheduleGridColumn } from './ScheduleGrid'

const meta: Meta<typeof ScheduleGrid> = {
  title: 'UI-KIT/ScheduleGrid',
  component: ScheduleGrid,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Schedule',
    startMinute: 9 * 60,
    endMinute: 19 * 60,
    onItemClick: () => {},
    onEmptyClick: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ScheduleGrid>

const day: ScheduleGridColumn[] = [
  {
    id: 'anna',
    label: 'Anna',
    items: [
      {
        id: '1',
        startMinute: 9 * 60,
        endMinute: 10 * 60,
        children: 'Haircut · Olga',
      },
      {
        id: '2',
        startMinute: 11 * 60,
        endMinute: 12 * 60 + 30,
        children: 'Colour · Ivan',
        colorScheme: 'green',
      },
    ],
  },
  {
    id: 'ben',
    label: 'Ben',
    items: [
      {
        id: '3',
        startMinute: 10 * 60,
        endMinute: 11 * 60,
        children: 'Free 3 of 8',
        colorScheme: 'grey',
      },
    ],
  },
  {
    id: 'carl',
    label: 'Carl',
    items: [
      {
        id: '4',
        startMinute: 14 * 60,
        endMinute: 15 * 60,
        children: 'No show',
        colorScheme: 'red',
      },
    ],
  },
]

export const Default: Story = { args: { columns: day } }

export const OverlappingItems: Story = {
  args: {
    columns: [
      {
        id: 'anna',
        label: 'Anna',
        items: [
          { id: 'a', startMinute: 600, endMinute: 720, children: 'A' },
          {
            id: 'b',
            startMinute: 630,
            endMinute: 690,
            children: 'B',
            colorScheme: 'green',
          },
          {
            id: 'c',
            startMinute: 660,
            endMinute: 780,
            children: 'C',
            colorScheme: 'grey',
          },
          { id: 'd', startMinute: 840, endMinute: 900, children: 'D (alone)' },
        ],
      },
    ],
  },
}

export const ManyColumns: Story = {
  args: {
    columns: Array.from({ length: 12 }, (_, i) => ({
      id: `m${i}`,
      label: `Master ${i + 1}`,
      items: [
        {
          id: `i${i}`,
          startMinute: (9 + (i % 5)) * 60,
          endMinute: (10 + (i % 5)) * 60,
          children: `Booking ${i + 1}`,
        },
      ],
    })),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export const Empty: Story = {
  args: { columns: [{ id: 'anna', label: 'Anna', items: [] }] },
}

// 15 and 30 minute bookings are the smallest a grid has to keep readable.
export const ShortItems: Story = {
  args: {
    columns: [
      {
        id: 'anna',
        label: 'Anna',
        items: [
          { id: 's1', startMinute: 600, endMinute: 615, children: 'Fringe' },
          {
            id: 's2',
            startMinute: 630,
            endMinute: 660,
            children: 'Wash · Olga',
            colorScheme: 'green',
          },
          {
            id: 's3',
            startMinute: 660,
            endMinute: 675,
            children: 'Consult',
            colorScheme: 'grey',
          },
        ],
      },
    ],
  },
}

export const FadedItems: Story = {
  args: {
    columns: [
      {
        id: 'anna',
        label: 'Anna',
        items: [
          {
            id: 'f1',
            startMinute: 9 * 60,
            endMinute: 10 * 60,
            children: 'Yoga · ended',
            faded: true,
          },
          {
            id: 'f2',
            startMinute: 10 * 60,
            endMinute: 11 * 60,
            children: 'Pilates · ended',
            colorScheme: 'green',
            faded: true,
          },
          {
            id: 'f3',
            startMinute: 11 * 60,
            endMinute: 12 * 60,
            children: 'Stretch · in progress',
            colorScheme: 'green',
          },
        ],
      },
    ],
  },
}
