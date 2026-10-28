import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { ComponentProps, useRef, useState } from 'react'
import { Button } from '../Button'
import { Stack } from '../_storybook/Stack'
import { colorsUIKIT } from '../colors'
import { Typography } from '../Typography'
import { Popover, PopoverSide } from './Popover'

const meta: Meta<typeof Popover> = {
  title: 'UI-KIT/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    side: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    align: { control: 'select', options: ['start', 'center', 'end'] },
    sideOffset: { control: 'number' },
    alignOffset: { control: 'number' },
    arrow: { control: 'boolean' },
    backdrop: { control: 'boolean' },
    modal: { control: 'boolean' },
  },
  args: {
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    arrow: false,
    backdrop: false,
    modal: false,
    onOpenChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Popover>

type DemoProps = Omit<
  ComponentProps<typeof Popover>,
  'open' | 'anchor' | 'children'
> & {
  label?: string
  defaultOpen?: boolean
}

const Card = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      maxWidth: 240,
      padding: 16,
      borderRadius: 'var(--radius-md)',
      background: colorsUIKIT.greyscale.white,
      boxShadow: '0 8px 24px rgb(0 0 0 / 12%)',
    }}
  >
    <Typography variant="h7">Popover title</Typography>
    <Typography variant="t3" color="greyscale.500">
      Any content goes here. Press Escape or click outside to close.
    </Typography>
  </div>
)

const Demo = (props: DemoProps) => {
  const anchor = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(props.defaultOpen ?? false)

  return (
    <>
      <Button
        ref={anchor}
        colorScheme="white"
        onClick={() => setOpen((v) => !v)}
      >
        {props.label ?? 'Toggle popover'}
      </Button>
      <Popover
        aria-label="Popover title"
        {...props}
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          props.onOpenChange?.(v)
        }}
        anchor={anchor}
      >
        <Card />
      </Popover>
    </>
  )
}

export const Playground: Story = {
  render: (args) => <Demo {...args} />,
}

export const WithArrow: Story = {
  render: (args) => <Demo {...args} />,
  args: {
    arrow: true,
  },
}

export const WithBackdrop: Story = {
  render: (args) => <Demo {...args} />,
  args: {
    backdrop: true,
    modal: true,
  },
}

export const Sides: Story = {
  render: (args) => (
    <Stack direction="row" spacing={4} style={{ padding: 160 }}>
      {(['top', 'bottom', 'left', 'right'] as PopoverSide[]).map((side) => (
        <Demo
          key={side}
          side={side}
          label={side}
          arrow
          onOpenChange={args.onOpenChange}
        />
      ))}
    </Stack>
  ),
}
