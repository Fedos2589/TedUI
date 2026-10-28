import type { Meta, StoryObj } from '@storybook/react'
import { Fragment } from 'react'
import { fn } from 'storybook/test'
import { RiArrowRightLine } from '@remixicon/react'
import { IconButton, IconButtonColorScheme, IconButtonSize } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'UI-KIT/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
    'aria-label': 'Next',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['extraBig', 'big', 'medium', 'small'],
    },
    colorScheme: {
      control: 'select',
      options: [
        'white',
        'grey',
        'whiteBlue',
        'greyBlue',
        'blue',
        'transparent',
      ],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof IconButton>

// Figma sizes the glyph per button size: 20px everywhere except small (16px).
// The component doesn't enforce it — the caller passes the icon already sized.
const iconSizeByButtonSize: Record<IconButtonSize, number> = {
  extraBig: 20,
  big: 20,
  medium: 20,
  small: 16,
}

export const Default: Story = {
  args: { children: <RiArrowRightLine size={iconSizeByButtonSize.extraBig} /> },
}

export const Matrix: Story = {
  render: (args) => {
    const schemes: IconButtonColorScheme[] = [
      'white',
      'grey',
      'whiteBlue',
      'greyBlue',
      'blue',
      'transparent',
    ]
    const sizes: IconButtonSize[] = ['extraBig', 'big', 'medium', 'small']
    const states = [
      { label: 'Initial', props: {} },
      { label: 'Loading', props: { loading: true } },
      { label: 'Disabled', props: { disabled: true } },
    ]

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `80px repeat(${schemes.length}, 1fr)`,
          gap: '24px 16px',
          alignItems: 'center',
          background: '#f5f7fd',
          padding: 24,
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <div />
        {schemes.map((s) => (
          <div
            key={s}
            style={{ fontWeight: 600, textAlign: 'center', fontSize: 13 }}
          >
            {s}
          </div>
        ))}

        {/* State rows */}
        {states.map(({ label, props }) => (
          <Fragment key={label}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
            {schemes.map((colorScheme) => (
              <div
                key={colorScheme}
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {sizes.map((size) => (
                  <IconButton
                    key={size}
                    size={size}
                    colorScheme={colorScheme}
                    onClick={args.onClick}
                    aria-label={args['aria-label']}
                    {...props}
                  >
                    <RiArrowRightLine size={iconSizeByButtonSize[size]} />
                  </IconButton>
                ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    )
  },
}
