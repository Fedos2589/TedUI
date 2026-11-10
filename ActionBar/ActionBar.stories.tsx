import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'
import { Input } from '../Input'
import { ActionBar } from './ActionBar'

const meta: Meta<typeof ActionBar> = {
  title: 'UI-KIT/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The main action(s) of a form or a step. Below 768px it is pinned to the bottom of the screen, above the home indicator and above the on-screen keyboard; wider, it sits in the flow. Narrow the canvas to see it pinned.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ActionBar>

const fields = [
  'Your name',
  'Email',
  'Password',
  'Business name',
  'Booking page address',
  'Phone',
  'City',
]

// Taller than a phone screen, so the bar has something to stay pinned over.
export const LongForm: Story = {
  render: () => (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 400,
      }}
    >
      {fields.map((label) => (
        <Input key={label} label={label} fullWidth />
      ))}
      <ActionBar>
        <Button type="submit" variant="solid" colorScheme="black" fullWidth>
          Create account
        </Button>
        <Button type="button" variant="ghost" colorScheme="grey" fullWidth>
          Back
        </Button>
      </ActionBar>
    </form>
  ),
}

export const SingleAction: Story = {
  render: () => (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 400,
      }}
    >
      <Input label="Email" type="email" fullWidth />
      <ActionBar>
        <Button type="submit" variant="solid" colorScheme="black" fullWidth>
          Continue
        </Button>
      </ActionBar>
    </form>
  ),
}
