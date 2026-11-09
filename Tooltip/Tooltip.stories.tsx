import type { Meta, StoryObj } from '@storybook/react'
import { CSSProperties } from 'react'
import { fn } from 'storybook/test'
import { Button } from '../Button/Button'
import { Tooltip } from './index'

const center: CSSProperties = {
  display: 'flex',
  gap: 48,
  padding: 80,
  flexWrap: 'wrap',
}

const LONG_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

const meta: Meta<typeof Tooltip> = {
  title: 'UI-KIT/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    arrow: { control: 'boolean' },
  },
  args: {
    content: 'Short text',
    colorScheme: 'light',
    side: 'top',
    onOpenChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Playground: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button colorScheme="blue">Hover me</Button>
    </Tooltip>
  ),
}

export const Themes: Story = {
  render: (args) => (
    <div style={center}>
      <Tooltip
        content="Short text"
        colorScheme="light"
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light</Button>
      </Tooltip>
      <Tooltip
        content="Short text"
        colorScheme="dark"
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="black">Dark</Button>
      </Tooltip>
    </div>
  ),
}

export const LongText: Story = {
  render: (args) => (
    <div style={center}>
      <Tooltip
        content={LONG_TEXT}
        colorScheme="light"
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light · long</Button>
      </Tooltip>
      <Tooltip
        content={LONG_TEXT}
        colorScheme="dark"
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="black">Dark · long</Button>
      </Tooltip>
    </div>
  ),
}

export const Placements: Story = {
  render: (args) => (
    <div style={{ ...center, gap: 64 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip
          key={side}
          content={side}
          side={side}
          onOpenChange={args.onOpenChange}
        >
          <Button colorScheme="white">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const WithArrow: Story = {
  render: (args) => (
    <div style={center}>
      <Tooltip
        content="Light with arrow"
        arrow
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light</Button>
      </Tooltip>
      <Tooltip
        content="Dark with arrow"
        colorScheme="dark"
        arrow
        defaultOpen
        side="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="black">Dark</Button>
      </Tooltip>
    </div>
  ),
}
