import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import Shield from '../assets/images/3d-icons/shield.webp'
import { SuccessScreen } from './index'

const meta: Meta<typeof SuccessScreen> = {
  title: 'UI-KIT/SuccessScreen',
  component: SuccessScreen,
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
    image: Shield,
    title: 'Lorem ipsum!',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    buttonProps: {
      children: 'Close',
      onClick: fn(),
    },
  },
}

export default meta
type Story = StoryObj<typeof SuccessScreen>

export const Default: Story = {}

export const CustomButton: Story = {
  args: {
    title: 'Dolor sit amet',
    description: 'Sed do eiusmod tempor incididunt ut labore.',
    buttonProps: {
      children: 'Lorem ipsum',
      colorScheme: 'black',
      onClick: fn(),
    },
  },
}
