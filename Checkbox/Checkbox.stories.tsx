import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Checkbox } from './index'
import { useState } from 'react'

const meta = {
  title: 'UI-KIT/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Checkbox label',
  },
}

export const WithoutLabel: Story = {
  args: { 'aria-label': 'Accept terms' },
}

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Error checkbox',
    error: true,
  },
}

export const ErrorChecked: Story = {
  args: {
    label: 'Error checked',
    error: true,
    defaultChecked: true,
  },
}

export const WithHint: Story = {
  args: {
    label: 'Checkbox with hint',
    hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    defaultChecked: true,
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox
          label="Controlled checkbox"
          checked={checked}
          onCheckedChange={(value, details) => {
            setChecked(value)
            args.onCheckedChange?.(value, details)
          }}
        />
        <p>Checked: {checked ? 'Yes' : 'No'}</p>
      </div>
    )
  },
}

export const Neutral: Story = {
  args: {
    label: 'Neutral checkbox',
    colorScheme: 'neutral',
  },
}

export const NeutralChecked: Story = {
  args: {
    label: 'Neutral checked',
    colorScheme: 'neutral',
    defaultChecked: true,
  },
}

export const NeutralDisabled: Story = {
  args: {
    label: 'Neutral disabled',
    colorScheme: 'neutral',
    disabled: true,
  },
}

export const NeutralDisabledChecked: Story = {
  args: {
    label: 'Neutral disabled checked',
    colorScheme: 'neutral',
    disabled: true,
    defaultChecked: true,
  },
}

export const Group: Story = {
  render: (args) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox
          label="Option 1"
          defaultChecked
          onCheckedChange={args.onCheckedChange}
        />
        <Checkbox label="Option 2" onCheckedChange={args.onCheckedChange} />
        <Checkbox label="Option 3" onCheckedChange={args.onCheckedChange} />
        <Checkbox
          label="Option 4 (disabled)"
          disabled
          onCheckedChange={args.onCheckedChange}
        />
      </div>
    )
  },
}
