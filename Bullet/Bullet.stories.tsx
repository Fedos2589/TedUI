import type { Meta, StoryObj } from '@storybook/react'
import { Bullet } from './Bullet'

const meta: Meta<typeof Bullet> = {
  title: 'UI-KIT/Bullet',
  component: Bullet,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    state: {
      control: 'select',
      options: ['empty', 'ok', 'not_ok'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Bullet>

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Bullet title="Lorem ipsum dolor sit amet" state="ok" />
      <Bullet title="Consectetur adipiscing elit" state="empty" />
      <Bullet title="Sed do eiusmod tempor" state="not_ok" />
    </div>
  ),
}

export const Size: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Bullet title="Default size (14)" state="ok" />
      <Bullet title="Larger icon (20)" state="ok" size={20} />
    </div>
  ),
}
