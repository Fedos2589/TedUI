import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { TagSelect, TagSelectOption } from './TagSelect'

const OPTIONS: TagSelectOption[] = [
  { value: 1, label: '🖥️ Lorem' },
  { value: 2, label: '🩺 Ipsum' },
  { value: 3, label: '🌐 Dolor' },
  { value: 4, label: '🖊️ Sit amet' },
  { value: 5, label: '📋 Consectetur' },
  { value: 6, label: '💬 Adipiscing' },
  { value: 7, label: '📞 Elit sed' },
  { value: 8, label: '💸 Eiusmod' },
  { value: 9, label: '💻 Ut enim' },
  { value: 10, label: '🎥 Tempor' },
  { value: 11, label: '📚 Incididunt' },
  { value: 12, label: '💰 Labore' },
  { value: 13, label: '🏦 Dolore' },
  { value: 14, label: '📝 Magna aliqua' },
  { value: 15, label: '🎨 Veniam', disabled: true },
]

const meta: Meta<typeof TagSelect> = {
  title: 'UI-KIT/TagSelect',
  component: TagSelect,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['blue', 'grey', 'emerald'] },
    size: { control: 'select', options: ['small', 'medium', 'big'] },
  },
  args: {
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof TagSelect>

const Controlled = ({
  multiple = true,
  colorScheme = 'blue',
  size = 'medium',
  onChange,
}: {
  multiple?: boolean
  colorScheme?: 'blue' | 'grey' | 'emerald'
  size?: 'small' | 'medium' | 'big'
  onChange?: (value: number[]) => void
}) => {
  const [value, setValue] = useState<number[]>([3, 8, 12])
  return (
    <TagSelect
      options={OPTIONS}
      aria-label="Lorem ipsum"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
      multiple={multiple}
      colorScheme={colorScheme}
      size={size}
    />
  )
}

export const Multiple: Story = {
  render: (args) => <Controlled multiple onChange={args.onChange} />,
}

export const Single: Story = {
  render: (args) => <Controlled multiple={false} onChange={args.onChange} />,
}

export const Grey: Story = {
  render: (args) => <Controlled colorScheme="grey" onChange={args.onChange} />,
}
