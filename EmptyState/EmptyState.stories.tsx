import type { Meta, StoryObj } from '@storybook/react'
import { RiCalendarLine } from '@remixicon/react'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { EmptyState } from './index'

const meta: Meta<typeof EmptyState> = {
  title: 'UI-KIT/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: <RiCalendarLine />,
    title: 'No clients yet',
    text: 'Clients appear here after their first booking.',
    headingLevel: 2,
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    children: (
      <Button size="large" colorScheme="blue" onClick={fn()}>
        Add a client
      </Button>
    ),
  },
}

export const TitleOnly: Story = { args: { icon: undefined, text: undefined } }

export const LongText: Story = {
  args: {
    title: 'Nobody has booked this master for the selected week yet',
    text: 'Clients appear here after their first booking. Share the booking link, or add a booking yourself from the calendar to see how it looks.',
  },
}
