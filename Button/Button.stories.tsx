import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI-KIT/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['solid', 'ghost'] },
    colorScheme: {
      control: 'select',
      options: [
        'black',
        'grey',
        'white',
        'lightBlue',
        'blue',
        'red',
        'lightRed',
        'outline',
      ],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Button' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button onClick={args.onClick} size="small">
        Small
      </Button>
      <Button onClick={args.onClick} size="medium">
        Medium
      </Button>
      <Button onClick={args.onClick} size="large">
        Large
      </Button>
    </div>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button onClick={args.onClick} variant="solid">
        Solid
      </Button>
      <Button onClick={args.onClick} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Button onClick={args.onClick} colorScheme="black">
        Black
      </Button>
      <Button onClick={args.onClick} colorScheme="grey">
        Grey
      </Button>
      <Button onClick={args.onClick} colorScheme="white">
        White
      </Button>
      <Button onClick={args.onClick} colorScheme="outline">
        Outline
      </Button>
      <Button onClick={args.onClick} colorScheme="lightBlue">
        Light Blue
      </Button>
      <Button onClick={args.onClick} colorScheme="blue">
        Blue
      </Button>
      <Button onClick={args.onClick} colorScheme="red">
        Red
      </Button>
      <Button onClick={args.onClick} colorScheme="lightRed">
        Light Red
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button onClick={args.onClick} loading size="small">
        Small
      </Button>
      <Button onClick={args.onClick} loading size="medium">
        Medium
      </Button>
      <Button onClick={args.onClick} loading size="large">
        Large
      </Button>
      <Button onClick={args.onClick} loading colorScheme="outline">
        Outline
      </Button>
      <Button onClick={args.onClick} loading variant="ghost" colorScheme="blue">
        Ghost
      </Button>
    </div>
  ),
}

export const ButtonMatrix: Story = {
  render: (args) => {
    const colorSchemes = [
      { colorScheme: 'black' as const, label: 'Black' },
      { colorScheme: 'grey' as const, label: 'Grey' },
      { colorScheme: 'white' as const, label: 'White' },
      { colorScheme: 'outline' as const, label: 'Outline' },
      { colorScheme: 'lightBlue' as const, label: 'Light Blue' },
      { colorScheme: 'blue' as const, label: 'Blue' },
      { colorScheme: 'red' as const, label: 'Red' },
      { colorScheme: 'lightRed' as const, label: 'Light Red' },
    ]
    const sizes = ['small', 'medium', 'large'] as const

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto repeat(8, 1fr)',
          gap: '24px 16px',
          alignItems: 'start',
        }}
      >
        {/* Header row */}
        <div></div>
        {colorSchemes.map((scheme) => (
          <div
            key={scheme.label}
            style={{ fontWeight: 600, textAlign: 'center' }}
          >
            {scheme.label}
          </div>
        ))}

        {/* Initial state row */}
        <div style={{ fontWeight: 600 }}>Initial</div>
        {colorSchemes.map((scheme) => (
          <div
            key={scheme.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {sizes.map((size) => (
              <Button
                onClick={args.onClick}
                key={size}
                size={size}
                colorScheme={scheme.colorScheme}
              >
                Button
              </Button>
            ))}
          </div>
        ))}

        {/* Disabled state row */}
        <div style={{ fontWeight: 600 }}>Disabled</div>
        {colorSchemes.map((scheme) => (
          <div
            key={scheme.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
            }}
          >
            {sizes.map((size) => (
              <Button
                onClick={args.onClick}
                key={size}
                size={size}
                disabled
                colorScheme={scheme.colorScheme}
              >
                Button
              </Button>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
