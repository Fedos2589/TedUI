import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SlotPicker, type SlotPickerDay, type SlotPickerSlot } from './SlotPicker'

const meta: Meta<typeof SlotPicker> = {
  title: 'UI-KIT/SlotPicker',
  component: SlotPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SlotPicker>

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const makeDays = (count: number, emptyIndexes: number[] = []): SlotPickerDay[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `d${i}`,
    weekday: weekdays[i % 7],
    number: String(i + 1),
    today: i === 0,
    empty: emptyIndexes.includes(i),
  }))

const hours: SlotPickerSlot[] = ['10:00', '11:00', '12:00', '13:30', '15:00', '16:30'].map((label) => ({
  id: label,
  label,
}))

const groups: SlotPickerSlot[] = [
  { id: 'g1', label: '17:00', hint: 'Football · free 3 of 10' },
  { id: 'g2', label: '18:30', hint: 'Football · full', disabled: true },
  { id: 'g3', label: '19:30', hint: 'Yoga · free 8 of 12' },
]

const Template = ({
  days,
  slotsByDay,
}: {
  days: SlotPickerDay[]
  slotsByDay: (dayId: string) => SlotPickerSlot[]
}) => {
  const [day, setDay] = useState(days[0].id)
  const [value, setValue] = useState<string | null>(null)
  return (
    <SlotPicker
      days={days}
      day={day}
      onDayChange={(id) => {
        setDay(id)
        setValue(null)
      }}
      slots={slotsByDay(day)}
      value={value}
      onChange={setValue}
      emptyText="No free times this day"
      daysLabel="Day"
      slotsLabel="Time"
    />
  )
}

export const Hours: Story = {
  render: () => <Template days={makeDays(14, [2])} slotsByDay={(d) => (d === 'd2' ? [] : hours)} />,
}

export const GroupsWithHints: Story = {
  render: () => <Template days={makeDays(7)} slotsByDay={() => groups} />,
}

export const EmptyDay: Story = {
  render: () => <Template days={makeDays(7, [0])} slotsByDay={() => []} />,
}
