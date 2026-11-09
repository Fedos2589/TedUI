import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../_storybook/Stack'
import { colorTokens } from '../colors'
import { Spinner, type SpinnerSize } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'UI-KIT/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    color: { control: 'select', options: colorTokens },
  },
  args: {
    size: 'large',
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Playground: Story = {}

const SIZES: SpinnerSize[] = ['small', 'medium', 'large']

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      {SIZES.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </Stack>
  ),
}

export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={4} alignItems="center">
      <Spinner color="blue-300" />
      <Spinner color="red-300" />
    </Stack>
  ),
}
