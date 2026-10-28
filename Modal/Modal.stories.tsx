import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'
import { Typography } from '../Typography'

const meta: Meta<typeof Modal> = {
  title: 'UI-KIT/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    isVisible: { control: 'boolean' },
  },
  args: {
    onClose: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Modal>

const ModalDemo = ({
  triggerLabel = 'Open modal',
  ...modalProps
}: React.ComponentProps<typeof Modal> & { triggerLabel?: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="solid" colorScheme="black" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal
        {...modalProps}
        isVisible={open}
        onClose={() => {
          setOpen(false)
          modalProps.onClose?.()
        }}
      />
    </>
  )
}

const sampleParagraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

export const Default: Story = {
  render: (args) => (
    <ModalDemo {...args}>
      <Typography variant="t3">{sampleParagraph}</Typography>
    </ModalDemo>
  ),
  args: {
    title: 'Lorem ipsum',
  },
}

/**
 * `subtitle` adds a second line under the title — a summary of the state the
 * dialog is in, the way the date picker reports the range being picked.
 */
export const WithSubtitle: Story = {
  render: (args) => (
    <ModalDemo {...args}>
      <Typography variant="t3">{sampleParagraph}</Typography>
    </ModalDemo>
  ),
  args: {
    title: 'Lorem ipsum',
    subtitle: '24 – 31 July, 7 days',
  },
}

export const WithButtons: Story = {
  render: (args) => (
    <ModalDemo {...args}>
      <Typography variant="t3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
    </ModalDemo>
  ),
  args: {
    title: 'Lorem ipsum',
    buttons: [
      {
        variant: 'ghost',
        colorScheme: 'grey',
        children: 'Cancel',
        fullWidth: true,
        onClick: fn(),
      },
      {
        variant: 'solid',
        colorScheme: 'red',
        children: 'Delete',
        fullWidth: true,
        onClick: fn(),
      },
    ],
  },
}

export const WithBackButton: Story = {
  render: (args) => {
    const Wrapper = () => {
      const [open, setOpen] = useState(false)

      return (
        <>
          <Button
            variant="solid"
            colorScheme="black"
            onClick={() => setOpen(true)}
          >
            Open multi-step modal
          </Button>
          <Modal
            {...args}
            isVisible={open}
            onClose={() => {
              setOpen(false)
              args.onClose?.()
            }}
            onBack={() => {
              setOpen(false)
              args.onBack?.()
            }}
          >
            <Typography variant="t3">
              This modal exposes both a back arrow (left) and a close icon
              (right). Use {`onBack`} when the modal is part of a multi-step
              flow.
            </Typography>
          </Modal>
        </>
      )
    }
    return <Wrapper />
  },
  args: {
    title: 'Step 2 of 3',
    onBack: fn(),
  },
}

export const LongTitle: Story = {
  render: (args) => (
    <ModalDemo {...args}>
      <Typography variant="t3">{sampleParagraph}</Typography>
    </ModalDemo>
  ),
  args: {
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
}

export const RichContent: Story = {
  render: (args) => (
    <ModalDemo {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Typography variant="h6">Lorem ipsum</Typography>
        <Typography variant="t3">{sampleParagraph}</Typography>
        <Typography variant="h6">Dolor sit amet</Typography>
        <Typography variant="t3">
          The modal grows with its content. On mobile it pins to the bottom and
          slides up; on desktop it appears centered with a max width of 640px.
        </Typography>
        <Typography variant="t3">{sampleParagraph}</Typography>
      </div>
    </ModalDemo>
  ),
  args: {
    title: 'Modal with longer content',
    buttons: [
      {
        variant: 'solid',
        colorScheme: 'blue',
        children: 'Got it',
        fullWidth: true,
        onClick: fn(),
      },
    ],
  },
}
