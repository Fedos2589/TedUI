import type { Meta, StoryObj } from '@storybook/react'
import { Fragment } from 'react'
import { fn } from 'storybook/test'
import { Avatar, AvatarSize } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI-KIT/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['100', '72', '60', '52', '40', '32', '24', '20', '16'],
    },
    src: { control: 'text' },
    initials: { control: 'text' },
    onClick: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

const labelStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 11,
  color: '#919cad',
  textAlign: 'center',
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
}

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

// =============================================================================
// User
// =============================================================================

export const User: Story = {
  args: {
    size: '16',
  },

  render: (args) => (
    <div style={groupStyle}>
      <div style={cellStyle}>
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          size="52"
          alt="Alex Adams"
        />
        <div style={labelStyle}>Photo</div>
      </div>
      <div style={cellStyle}>
        <Avatar initials="AA" alt="Alex Adams" size="52" />
        <div style={labelStyle}>Initials</div>
      </div>
      <div style={cellStyle}>
        <Avatar size="52" />
        <div style={labelStyle}>Empty</div>
      </div>
      <div style={cellStyle}>
        <Avatar size="100" onClick={args.onClick} />
        <div style={labelStyle}>isInput</div>
      </div>
    </div>
  ),
}

// =============================================================================
// All sizes
// =============================================================================

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
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      {ALL_SIZES.map((size) => (
        <Avatar key={size} initials="AA" size={size} />
      ))}
    </div>
  ),
}

export const IsInputSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      {ALL_SIZES.map((size) => (
        <Avatar key={size} size={size} onClick={args.onClick} />
      ))}
    </div>
  ),
}

// =============================================================================
// Full matrix (as in design)
// =============================================================================

const MATRIX_STATES = [
  { label: 'Photo', src: 'https://i.pravatar.cc/150?img=3', initials: 'AA' },
  { label: 'Initials', initials: 'AA' },
  { label: 'Empty' },
]

export const DesignMatrix: Story = {
  render: () => (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${MATRIX_STATES.length}, 1fr)`,
          gap: 8,
          alignItems: 'center',
        }}
      >
        <div />
        {MATRIX_STATES.map((state) => (
          <div
            key={state.label}
            style={{
              fontSize: 11,
              color: '#919cad',
              textAlign: 'center',
            }}
          >
            {state.label}
          </div>
        ))}

        {ALL_SIZES.map((size) => (
          <Fragment key={size}>
            <div
              key={`label-${size}`}
              style={{ fontSize: 11, color: '#919cad' }}
            >
              {size}
            </div>
            {MATRIX_STATES.map((state) => (
              <div
                key={`${size}-${state.label}`}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Avatar size={size} initials={state.initials} src={state.src} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  ),
}
