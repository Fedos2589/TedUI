import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { useState } from 'react'

import { CodeField } from './CodeField'

const meta = {
  title: 'UI-KIT/CodeField',
  component: CodeField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: 'Confirmation code',
    length: 6,
    size: 'large',
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    length: { control: { type: 'number', min: 4, max: 8 } },
    fluid: { control: 'boolean' },
    error: { control: 'boolean' },
    errorText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CodeField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Type or paste a 6-digit string. Arrows, Home and End move the caret, so a
 * single wrong digit can be corrected in place; Backspace deletes and closes the
 * gap. The group is one Tab stop, so Tab moves on to the next element instead of
 * stepping through six boxes.
 */
export const Playground: Story = {
  args: { value: '' },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div style={{ width: 400 }}>
        <CodeField
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next)
            args.onChange(next)
          }}
        />
        <pre style={{ marginTop: 24, fontSize: 12 }}>
          value: {JSON.stringify(value)} ({value.length}/{args.length})
        </pre>
      </div>
    )
  },
}

export const Filled: Story = {
  args: { value: '123456' },
}

/** The error text is also pushed to a live region, so it is announced, not just shown. */
export const Error: Story = {
  args: {
    value: '',
    error: true,
    errorText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
}

/** Inputs are disabled while the code is being verified. */
export const Verifying: Story = {
  args: { value: '123456', disabled: true },
}

export const Medium: Story = {
  args: { value: '12', size: 'medium' },
}

export const Small: Story = {
  args: { value: '12', size: 'small' },
}

export const FourDigits: Story = {
  args: { value: '', length: 4 },
}

/** The boxes share the width of the column the field is given. */
export const Fluid: Story = {
  args: { value: '12', fluid: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <CodeField {...args} />
    </div>
  ),
}
