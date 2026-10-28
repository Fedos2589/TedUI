import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../_storybook/Stack'
import { colorsUIKIT } from '../colors'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'UI-KIT/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'range', min: 8, max: 96, step: 2 } },
    thickness: { control: { type: 'range', min: 1, max: 12, step: 1 } },
  },
  args: {
    size: 20,
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      {[12, 16, 20, 32, 48, 64].map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </Stack>
  ),
}

export const Thickness: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      {[1, 2, 4, 6].map((thickness) => (
        <Spinner key={thickness} size={48} thickness={thickness} />
      ))}
    </Stack>
  ),
}

export const CustomColor: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Spinner size={32} style={{ color: colorsUIKIT.blue[300] }} />
      <Spinner size={32} style={{ color: colorsUIKIT.red[300] }} />
    </Stack>
  ),
}
