import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, toast } from './Toast'
import { Button } from '../Button/Button'

const meta: Meta<typeof ToastProvider> = {
  title: 'UI-KIT/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ToastProvider>

// closeButton is a custom option carried through react-hot-toast's option spread;
// cast since the library's ToastOptions type doesn't know about it.
const noClose = { closeButton: false } as Parameters<typeof toast>[1]

const LONG_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

const persist = { duration: Infinity }

// All four semantic states from the design (node 1725:2979), each with a close
// button: notification (no status icon), positive, warning, negative.
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast('Toast text')}>Notification</Button>
      <Button onClick={() => toast.success('Toast text')}>Positive</Button>
      <Button onClick={() => toast.warning('Toast text')}>Warning</Button>
      <Button colorScheme="red" onClick={() => toast.error('Toast text')}>
        Negative
      </Button>
    </div>
  ),
}

export const Persistent: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast('Toast text', persist)}>Notification</Button>
      <Button onClick={() => toast.success('Toast text', persist)}>
        Positive
      </Button>
      <Button onClick={() => toast.warning('Toast text', persist)}>
        Warning
      </Button>
      <Button
        colorScheme="red"
        onClick={() => toast.error('Toast text', persist)}
      >
        Negative
      </Button>
    </div>
  ),
}

export const WithoutCloseButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast('Toast text', noClose)}>No icons</Button>
      <Button onClick={() => toast.success('Toast text', noClose)}>
        Left icon
      </Button>
      <Button onClick={() => toast.warning('Toast text', noClose)}>
        Warning (left icon)
      </Button>
    </div>
  ),
}

export const LongText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast.success(LONG_TEXT)}>Positive</Button>
      <Button onClick={() => toast.warning(LONG_TEXT)}>Warning</Button>
      <Button colorScheme="red" onClick={() => toast.error(LONG_TEXT)}>
        Negative
      </Button>
    </div>
  ),
}

const fakeRequest = (shouldFail: boolean) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (shouldFail ? reject() : resolve('ok')), 1500),
  )

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button
        onClick={() => {
          const id = toast.loading('Загрузка...')
          setTimeout(() => toast.success('Готово', { id }), 1500)
        }}
      >
        Loading → Success
      </Button>
    </div>
  ),
}

export const PromiseToast: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button
        onClick={() =>
          toast.promise(fakeRequest(false), {
            loading: 'Lorem ipsum...',
            success: 'Lorem ipsum dolor sit amet',
            error: 'Consectetur adipiscing elit',
          })
        }
      >
        Promise → Success
      </Button>
      <Button
        colorScheme="red"
        onClick={() =>
          toast.promise(fakeRequest(true), {
            loading: 'Dolor sit amet...',
            success: 'Sed do eiusmod tempor',
            error: 'Ut labore et dolore',
          })
        }
      >
        Promise → Error
      </Button>
    </div>
  ),
}
