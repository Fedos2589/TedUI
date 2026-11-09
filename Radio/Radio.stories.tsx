import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Radio, RadioProps } from './Radio'
import { RadioGroup, RadioGroupProps } from '../RadioGroup/RadioGroup'

type Args = RadioProps & Pick<RadioGroupProps, 'onValueChange'>

const meta = {
  title: 'UI-KIT/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: 'preview',
    onValueChange: fn(),
  },
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

export const Default: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="apple">
      <Radio value="apple" label="Apple" />
    </RadioGroup>
  ),
}

export const WithoutLabel: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="a">
      <Radio value="a" aria-label="Option A" />
    </RadioGroup>
  ),
}

export const Checked: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="checked">
      <Radio value="checked" label="Checked option" />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange}>
      <Radio value="x" label="Disabled option" disabled />
    </RadioGroup>
  ),
}

export const DisabledChecked: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="x">
      <Radio value="x" label="Disabled checked" disabled />
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('apple')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RadioGroup
          value={value}
          onValueChange={(v, e) => {
            setValue(v as string)
            args.onValueChange?.(v, e)
          }}
        >
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
          <Radio value="cherry" label="Cherry" />
        </RadioGroup>
        <p>Selected: {value}</p>
      </div>
    )
  },
}

export const WithHint: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="a">
      <Radio
        value="a"
        label="Option with hint"
        hint="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </RadioGroup>
  ),
}

export const Group: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="opt1">
      <Radio value="opt1" label="Option 1" />
      <Radio value="opt2" label="Option 2" />
      <Radio value="opt3" label="Option 3" />
      <Radio value="opt4" label="Option 4 (disabled)" disabled />
    </RadioGroup>
  ),
}

export const Green: Story = {
  render: (args) => (
    <RadioGroup onValueChange={args.onValueChange} defaultValue="opt1">
      <Radio value="opt1" label="Green option 1" colorScheme="green" />
      <Radio value="opt2" label="Green option 2" colorScheme="green" />
      <Radio
        value="opt3"
        label="Green option 3 (disabled)"
        colorScheme="green"
        disabled
      />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup
      onValueChange={args.onValueChange}
      defaultValue="m"
      orientation="horizontal"
    >
      <Radio value="s" label="Small" />
      <Radio value="m" label="Medium" />
      <Radio value="l" label="Large" />
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <RadioGroup onValueChange={args.onValueChange} defaultValue="a">
        <Radio value="a" label="Selected / Initial" />
      </RadioGroup>
      <RadioGroup onValueChange={args.onValueChange}>
        <Radio value="b" label="Unselected / Initial" />
      </RadioGroup>
      <RadioGroup onValueChange={args.onValueChange} defaultValue="c">
        <Radio value="c" label="Selected / Disabled" disabled />
      </RadioGroup>
      <RadioGroup onValueChange={args.onValueChange}>
        <Radio value="d" label="Unselected / Disabled" disabled />
      </RadioGroup>
    </div>
  ),
}
