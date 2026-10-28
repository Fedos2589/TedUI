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
    theme: { control: 'select', options: ['light', 'dark'] },
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end',
      ],
    },
    arrow: { control: 'boolean' },
  },
  args: {
    title: 'Short text',
    theme: 'light',
    placement: 'top',
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
        title="Short text"
        theme="light"
        defaultOpen
        placement="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light</Button>
      </Tooltip>
      <Tooltip
        title="Short text"
        theme="dark"
        defaultOpen
        placement="bottom"
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
        title={LONG_TEXT}
        theme="light"
        defaultOpen
        placement="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light · long</Button>
      </Tooltip>
      <Tooltip
        title={LONG_TEXT}
        theme="dark"
        defaultOpen
        placement="bottom"
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
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip
          key={placement}
          title={placement}
          placement={placement}
          onOpenChange={args.onOpenChange}
        >
          <Button colorScheme="white">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const WithArrow: Story = {
  render: (args) => (
    <div style={center}>
      <Tooltip
        title="Light with arrow"
        arrow
        defaultOpen
        placement="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="white">Light</Button>
      </Tooltip>
      <Tooltip
        title="Dark with arrow"
        theme="dark"
        arrow
        defaultOpen
        placement="bottom"
        onOpenChange={args.onOpenChange}
      >
        <Button colorScheme="black">Dark</Button>
      </Tooltip>
    </div>
  ),
}
