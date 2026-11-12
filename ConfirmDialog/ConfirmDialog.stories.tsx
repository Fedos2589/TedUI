import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from '../Button'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI-KIT/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    colorScheme: {
      control: { type: 'inline-radio' },
      options: ['black', 'red'],
    },
    loading: { control: 'boolean' },
  },
  args: {
    title: 'Delete this date?',
    confirmLabel: 'Delete',
    children: 'Fri, May 15',
    onConfirm: fn(),
    onClose: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

const Demo = (args: React.ComponentProps<typeof ConfirmDialog>) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="solid" colorScheme="black" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <ConfirmDialog
        {...args}
        isVisible={open}
        onConfirm={() => {
          args.onConfirm()
          setOpen(false)
        }}
        onClose={() => {
          args.onClose()
          setOpen(false)
        }}
      />
    </>
  )
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Save changes?', confirmLabel: 'Save', children: undefined },
}

// An action that cannot be undone.
export const Destructive: Story = {
  render: (args) => <Demo {...args} />,
  args: { colorScheme: 'red' },
}

export const Loading: Story = {
  render: (args) => <Demo {...args} />,
  args: { colorScheme: 'red', loading: true },
}

export const CustomCancelLabel: Story = {
  render: (args) => <Demo {...args} />,
  args: { colorScheme: 'red', cancelLabel: 'Keep it' },
}
