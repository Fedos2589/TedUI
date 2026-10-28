import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Stack } from '../_storybook/Stack'
import { Typography } from '../Typography'
import {
  ProgressBar,
  ProgressBarColorScheme,
  ProgressBarSize,
} from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'UI-KIT/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { 'aria-label': 'Profile completion' },
  argTypes: {
    size: {
      control: 'select',
      options: ['thin', 'small', 'medium', 'big'],
    },
    colorScheme: {
      control: 'select',
      options: ['blue', 'green'],
    },
    value: { control: { type: 'number', min: 0 } },
    max: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  args: {
    value: 607,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

// Fill is wide enough → label sits inside the fill, white text.
export const LabelInsideFill: Story = {
  name: 'Label inside fill (large %)',
  args: {
    value: 3200,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

// Fill is too narrow for the number → label is pushed outside the fill,
// dark text on the light background. Matches the "follows edge, inside"
// variant from the Figma source.
export const LabelOutsideFill: Story = {
  name: 'Label outside fill (small %)',
  args: {
    value: 607,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

// Only when `value === 0` we render the "0" placeholder at the left.
export const ZeroPlaceholder: Story = {
  args: {
    value: 0,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

export const Completed: Story = {
  args: {
    value: 5000,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

// The `caption` slot — arbitrary content pinned under the track with a 12px
// gap. Text goes through `Typography`: T3 / greyscale.400 next to the 24px
// track, per the Design System.
export const WithCaption: Story = {
  args: {
    value: 3200,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
    caption: (
      <Typography variant="t3" color="greyscale.400">
        Lorem ipsum dolor sit amet…
      </Typography>
    ),
  },
}

// Same bar without the slot — no caption row and no leftover gap.
export const WithoutCaption: Story = {
  args: {
    value: 3200,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
  },
}

// Figma `Type=S`: an 8px track with no number on it — the status text under
// the bar is the only label, and it steps down to T4.
export const Thin: Story = {
  args: {
    value: 1650,
    max: 5000,
    size: 'thin',
    colorScheme: 'green',
    caption: (
      <Typography variant="t4" color="greyscale.400">
        Consectetur adipiscing elit…
      </Typography>
    ),
  },
}

export const Sizes: Story = {
  render: () => {
    const sizes: ProgressBarSize[] = ['thin', 'small', 'medium', 'big']
    return (
      <Stack direction="column" spacing={3} width={480}>
        {sizes.map((size) => (
          <Stack key={size} direction="column" spacing={1}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#545D6C' }}>
              {size}
            </div>
            <ProgressBar
              aria-label="Profile completion"
              value={3200}
              max={5000}
              size={size}
            />
          </Stack>
        ))}
      </Stack>
    )
  },
}

export const ColorSchemes: Story = {
  render: () => {
    const schemes: ProgressBarColorScheme[] = ['blue', 'green']
    return (
      <Stack direction="column" spacing={3} width={480}>
        {schemes.map((colorScheme) => (
          <Stack key={colorScheme} direction="column" spacing={1}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#545D6C' }}>
              {colorScheme}
            </div>
            <ProgressBar
              aria-label="Profile completion"
              value={3200}
              max={5000}
              colorScheme={colorScheme}
            />
          </Stack>
        ))}
      </Stack>
    )
  },
}

// Sweep across percentages to visually verify the inside↔outside switch.
export const PercentageSweep: Story = {
  render: () => {
    const values = [0, 50, 200, 607, 1500, 2500, 4000, 5000]
    return (
      <Stack direction="column" spacing={2} width={480}>
        {values.map((value) => (
          <Stack key={value} direction="column" spacing={0.5}>
            <div
              style={{ fontSize: 12, fontWeight: 600, color: '#545D6C' }}
            >{`${value} / 5000`}</div>
            <ProgressBar
              aria-label="Profile completion"
              value={value}
              max={5000}
              size="big"
            />
          </Stack>
        ))}
      </Stack>
    )
  },
}

// Demonstrate the `format` prop — e.g. rendering as a percentage.
export const CustomFormat: Story = {
  args: {
    value: 3200,
    max: 5000,
    size: 'big',
    colorScheme: 'blue',
    format: (v: number) => `${Math.round((v / 5000) * 100)}%`,
  },
}

// Interactive playground — drag the slider to see the value update live,
// including the inside↔outside label switch and the 0 placeholder.
const InteractiveDemo = () => {
  const MAX = 5000
  const [value, setValue] = useState(607)

  return (
    <Stack direction="column" spacing={3} width={480}>
      <ProgressBar
        aria-label="Profile completion"
        value={value}
        max={MAX}
        size="big"
        colorScheme="blue"
      />

      <Stack direction="column" spacing={1}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 600,
            color: '#545D6C',
          }}
        >
          <span>value</span>
          <span>
            {value} / {MAX} ({Math.round((value / MAX) * 100)}%)
          </span>
        </div>
        <input
          type="range"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          min={0}
          max={MAX}
          step={1}
          aria-label="ProgressBar value"
          style={{ width: '100%' }}
        />
      </Stack>
    </Stack>
  )
}

export const Interactive: Story = {
  name: 'Interactive (slider)',
  render: () => <InteractiveDemo />,
}
