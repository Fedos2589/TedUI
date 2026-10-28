import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'UI-KIT/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: {
    variant: 'text',
    width: 240,
  },
}

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 240,
    height: 80,
  },
}

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: 240,
    height: 80,
  },
}

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
}

export const WaveAnimation: Story = {
  args: {
    variant: 'rounded',
    width: 240,
    height: 80,
    animation: 'wave',
  },
}

export const NoAnimation: Story = {
  args: {
    variant: 'rounded',
    width: 240,
    height: 80,
    animation: false,
  },
}

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, width: 320 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
      >
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="90%" height={12} />
        <Skeleton variant="rounded" width="100%" height={64} />
      </div>
    </div>
  ),
}
