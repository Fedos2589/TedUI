import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { RiShareLine } from '@remixicon/react'
import { IconButton } from '../IconButton/IconButton'
import { NavMobileHeader } from './NavMobileHeader'

const meta: Meta<typeof NavMobileHeader> = {
  title: 'UI-KIT/NavMobileHeader',
  component: NavMobileHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 375,
          margin: '0 auto',
          border: '1px solid var(--color-grey-200)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    align: { control: 'select', options: ['center', 'left'] },
  },
  args: {
    title: 'Settings',
    align: 'center',
    onBack: fn(),
    onMenuClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof NavMobileHeader>

export const Default: Story = {}

export const AlignLeft: Story = {
  args: {
    align: 'left',
  },
}

export const MenuIcon: Story = {
  args: {
    title: 'Feed',
    showMenuIcon: true,
  },
}

export const RightContent: Story = {
  args: {
    title: 'Profile',
    rightContent: (
      <IconButton aria-label="Share" size="small" colorScheme="transparent">
        <RiShareLine size={20} />
      </IconButton>
    ),
  },
}

export const WithoutBackButton: Story = {
  args: {
    title: 'Messages',
    hideBackButton: true,
  },
}
