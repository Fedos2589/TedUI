import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'

import { TimePicker } from './TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: 'UI-KIT/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: {
    label: 'Start',
    value: null,
    size: 'medium',
    colorScheme: 'white',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'big'] },
    colorScheme: {
      control: 'inline-radio',
      options: ['grey', 'grey-blue', 'white', 'beige'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    step: { control: 'number' },
  },
  // Keeps the value in the story so typing in the field works.
  render: function Render({ value: initial, onChange, ...args }) {
    const [value, setValue] = useState(initial)
    useEffect(() => setValue(initial), [initial])
    return (
      <TimePicker
        {...args}
        value={value}
        onChange={(minutes) => {
          setValue(minutes)
          onChange(minutes)
        }}
      />
    )
  },
}

export default meta
type Story = StoryObj<typeof TimePicker>

export const Default: Story = { args: { value: 540 } }

export const Empty: Story = {}

export const FiveMinuteStep: Story = {
  args: { value: 545, step: 5, helperText: 'Step is 5 minutes' },
}

export const Error: Story = {
  args: { value: 1080, error: true, errorText: 'End must be after start' },
}

export const Disabled: Story = { args: { value: 540, disabled: true } }

// Showcase rows fix only `size`; the rest comes from args.
export const AllSizes: Story = {
  argTypes: { size: { table: { disable: true } } },
  args: { value: 540 },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <TimePicker {...args} size="small" label="Small" />
      <TimePicker {...args} size="medium" label="Medium" />
      <TimePicker {...args} size="big" label="Big" />
    </div>
  ),
}

export const AllColorSchemes: Story = {
  argTypes: { colorScheme: { table: { disable: true } } },
  args: { value: 540 },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <TimePicker {...args} colorScheme="grey" label="Grey" />
      <TimePicker {...args} colorScheme="grey-blue" label="Grey-blue" />
      <TimePicker {...args} colorScheme="white" label="White" />
      <TimePicker {...args} colorScheme="beige" label="Beige" />
    </div>
  ),
}
