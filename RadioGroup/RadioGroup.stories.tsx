import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { RadioGroup } from './RadioGroup'
import { Radio } from '../Radio/Radio'

const meta = {
  title: 'UI-KIT/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="opt1">
      <Radio value="opt1" label="Option 1" />
      <Radio value="opt2" label="Option 2" />
      <Radio value="opt3" label="Option 3" />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="m" orientation="horizontal">
      <Radio value="s" label="Small" />
      <Radio value="m" label="Medium" />
      <Radio value="l" label="Large" />
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('opt1')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RadioGroup
          {...args}
          value={value}
          onValueChange={(v, e) => {
            setValue(v as string)
            args.onValueChange?.(v, e)
          }}
        >
          <Radio value="opt1" label="Option 1" />
          <Radio value="opt2" label="Option 2" />
          <Radio value="opt3" label="Option 3" />
        </RadioGroup>
        <p>Selected: {value}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="opt2" disabled>
      <Radio value="opt1" label="Option 1" />
      <Radio value="opt2" label="Option 2" />
      <Radio value="opt3" label="Option 3" />
    </RadioGroup>
  ),
}
