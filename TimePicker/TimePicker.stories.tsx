import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { TimePicker } from './TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: 'UI-KIT/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: { label: 'Start', value: null, size: 'medium', colorScheme: 'white' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'big'] },
    colorScheme: {
      control: 'select',
      options: ['grey', 'grey-blue', 'white', 'beige'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    step: { control: 'number' },
  },
  // Keeps the value in the story so typing in the field works.
  render: function Render({ value: initial, onChange: _onChange, ...args }) {
    const [value, setValue] = useState(initial)
    return <TimePicker {...args} value={value} onChange={setValue} />
  },
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Empty: Story = {}

export const WithValue: Story = { args: { value: 540 } }

export const FiveMinuteStep: Story = {
  args: { value: 545, step: 5, helperText: 'Step is 5 minutes' },
}

export const Error: Story = {
  args: { value: 1080, error: true, errorText: 'End must be after start' },
}

export const Disabled: Story = { args: { value: 540, disabled: true } }
