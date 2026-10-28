import { ChangeEventHandler, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { AvatarPicker } from './AvatarPicker'
import { AvatarSize } from './Avatar'

const meta: Meta<typeof AvatarPicker> = {
  title: 'UI-KIT/Avatar/AvatarPicker',
  component: AvatarPicker,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['100', '72', '60', '52', '40', '32', '24', '20', '16'],
    },
    avatar: { control: 'text' },
    onChange: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof AvatarPicker>

const labelStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 11,
  color: '#919cad',
  textAlign: 'center',
}

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
}

const InteractivePicker = ({
  size,
  onChange,
}: {
  size: AvatarSize
  onChange?: ChangeEventHandler<HTMLInputElement>
}) => {
  const [avatar, setAvatar] = useState<string | undefined>(undefined)

  return (
    <AvatarPicker
      size={size}
      avatar={avatar}
      onChange={(e) => {
        onChange?.(e)
        const file = e.target.files?.[0]
        if (file) {
          setAvatar(URL.createObjectURL(file))
        }
      }}
    />
  )
}

export const User: Story = {
  args: {
    size: '100',
  },
  render: (args) => (
    <InteractivePicker size={args.size ?? '100'} onChange={args.onChange} />
  ),
}

export const WithPreloadedAvatar: Story = {
  render: (args) => (
    <div style={groupStyle}>
      <div style={cellStyle}>
        <AvatarPicker
          size="100"
          avatar="https://i.pravatar.cc/150?img=3"
          onChange={args.onChange}
        />
        <div style={labelStyle}>User · with photo</div>
      </div>
    </div>
  ),
}

export const Empty: Story = {
  render: (args) => (
    <div style={groupStyle}>
      <div style={cellStyle}>
        <AvatarPicker size="100" onChange={args.onChange} />
        <div style={labelStyle}>User</div>
      </div>
    </div>
  ),
}

const ALL_SIZES: AvatarSize[] = [
  '100',
  '72',
  '60',
  '52',
  '40',
  '32',
  '24',
  '20',
  '16',
]

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      {ALL_SIZES.map((size) => (
        <AvatarPicker key={size} size={size} onChange={args.onChange} />
      ))}
    </div>
  ),
}
