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
    style: { width: 240 },
    variant: 'text',
  },
}

export const Rectangular: Story = {
  args: {
    style: { width: 240, height: 80 },
    variant: 'rectangular',
  },
}

export const Rounded: Story = {
  args: {
    style: { width: 240, height: 80 },
    variant: 'rounded',
  },
}

export const Circular: Story = {
  args: {
    style: { width: 48, height: 48 },
    variant: 'circular',
  },
}

export const WaveAnimation: Story = {
  args: {
    style: { width: 240, height: 80 },
    variant: 'rounded',
    animation: 'wave',
  },
}

export const NoAnimation: Story = {
  args: {
    style: { width: 240, height: 80 },
    variant: 'rounded',
    animation: 'none',
  },
}

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, width: 320 }}>
      <Skeleton variant="circular" style={{ width: 48, height: 48 }} />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
      >
        <Skeleton variant="text" style={{ width: '60%', height: 14 }} />
        <Skeleton variant="text" style={{ width: '90%', height: 12 }} />
        <Skeleton variant="rounded" style={{ width: '100%', height: 64 }} />
      </div>
    </div>
  ),
}
