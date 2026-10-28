import type { Meta, StoryObj } from '@storybook/react'
import { RiSparkling2Fill } from '@remixicon/react'
import { Stack } from '../_storybook/Stack'
import { colorsUIKIT } from '../colors'
import {
  FeaturedIcon,
  FeaturedIconColor,
  FeaturedIconSize,
  FeaturedIconVariant,
} from './FeaturedIcon'

const COLORS: FeaturedIconColor[] = [
  'grey',
  'blue',
  'red',
  'white',
  'green',
  'orange',
]
const SIZES: FeaturedIconSize[] = ['xl', 'l', 'm', 's', 'xs']
const VARIANTS: FeaturedIconVariant[] = ['light', 'solid']

const meta: Meta<typeof FeaturedIcon> = {
  title: 'UI-KIT/FeaturedIcon',
  component: FeaturedIcon,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    variant: { control: 'inline-radio', options: VARIANTS },
  },
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof FeaturedIcon>

// Box dimension + corner radius per size, so the Storybook page can be diffed
// against Figma at a glance.
const SPEC_BY_SIZE: Record<FeaturedIconSize, string> = {
  xl: '84 × 84 · r28',
  l: '72 × 72 · r24',
  m: '52 × 52 · r16',
  s: '40 × 40 · r12',
  xs: '32 × 32 · r12',
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: colorsUIKIT.greyscale[500],
}

export const Default: Story = {
  args: { color: 'blue', size: 'xl', variant: 'light' },
  render: (args) => (
    <FeaturedIcon {...args}>
      <RiSparkling2Fill />
    </FeaturedIcon>
  ),
}

export const AllColors: Story = {
  name: 'Colors × variants',
  render: () => (
    <Stack direction="column" spacing={4}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={3} alignItems="center">
          <div style={{ ...labelStyle, width: 48 }}>{variant}</div>
          {COLORS.map((color) => (
            <Stack
              key={color}
              direction="column"
              spacing={1}
              alignItems="center"
            >
              <FeaturedIcon color={color} variant={variant}>
                <RiSparkling2Fill />
              </FeaturedIcon>
              <div style={labelStyle}>{color}</div>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
}

export const AllSizes: Story = {
  name: 'Sizes',
  render: () => (
    <Stack direction="row" spacing={3} alignItems="flex-end">
      {SIZES.map((size) => (
        <Stack key={size} direction="column" spacing={1} alignItems="center">
          <FeaturedIcon size={size}>
            <RiSparkling2Fill />
          </FeaturedIcon>
          <div style={labelStyle}>{size.toUpperCase()}</div>
          <div style={{ ...labelStyle, fontWeight: 500 }}>
            {SPEC_BY_SIZE[size]}
          </div>
        </Stack>
      ))}
    </Stack>
  ),
}

export const Grid: Story = {
  name: 'All colors × all sizes',
  render: () => (
    <Stack direction="column" spacing={5}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="column" spacing={4}>
          <div style={labelStyle}>{variant}</div>
          {SIZES.map((size) => (
            <Stack key={size} direction="row" spacing={3} alignItems="center">
              <div style={{ ...labelStyle, width: 32 }}>
                {size.toUpperCase()}
              </div>
              {COLORS.map((color) => (
                <FeaturedIcon
                  key={color}
                  size={size}
                  color={color}
                  variant={variant}
                >
                  <RiSparkling2Fill />
                </FeaturedIcon>
              ))}
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
}
