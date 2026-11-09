import type { Meta, StoryObj } from '@storybook/react'
import { CSSProperties } from 'react'
import { fn } from 'storybook/test'
import {
  RiStarLine,
  RiHeartLine,
  RiCheckLine,
  RiUserLine,
  RiFireLine,
  RiAddLine,
  RiSubtractLine,
} from '@remixicon/react'
import { Tag } from './Tag'

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
}

const column: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const meta: Meta<typeof Tag> = {
  title: 'UI-KIT/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'big'],
    },
    colorScheme: {
      control: 'select',
      options: ['blue', 'grey', 'emerald', 'orange'],
    },
    isActive: { control: 'boolean' },
  },
  args: {
    label: '💻️ Lorem ipsum',
    variant: 'filled',
    size: 'medium',
    colorScheme: 'blue',
  },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div style={row}>
      <Tag label="Filled" variant="filled" />
      <Tag label="Outlined" variant="outlined" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Tag label="Small" size="small" />
      <Tag label="Medium" size="medium" />
      <Tag label="Big" size="big" />
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: () => (
    <div style={row}>
      <Tag label="Blue" colorScheme="blue" />
      <Tag label="Blue Outlined" colorScheme="blue" variant="outlined" />
      <Tag label="Grey" colorScheme="grey" />
      <Tag label="Grey Outlined" colorScheme="grey" variant="outlined" />
      <Tag label="Emerald" colorScheme="emerald" />
      <Tag label="Emerald Outlined" colorScheme="emerald" variant="outlined" />
      <Tag label="Orange" colorScheme="orange" />
      <Tag label="Orange Outlined" colorScheme="orange" variant="outlined" />
    </div>
  ),
}

/**
 * Initial / Hover / Click are interaction states driven by CSS — hover and
 * press the tags below to see them. `Selected` is the `isActive` prop.
 */
export const States: Story = {
  render: () => (
    <div style={column}>
      <div style={row}>
        <Tag label="Blue · Initial" colorScheme="blue" />
        <Tag label="Blue · Selected" colorScheme="blue" isActive />
        <Tag label="Grey · Initial" colorScheme="grey" />
        <Tag label="Grey · Selected" colorScheme="grey" isActive />
        <Tag label="Emerald · Initial" colorScheme="emerald" />
        <Tag label="Emerald · Selected" colorScheme="emerald" isActive />
        <Tag label="Orange · Initial" colorScheme="orange" />
        <Tag label="Orange · Selected" colorScheme="orange" isActive />
      </div>
      <div style={row}>
        <Tag
          label="Blue Outlined · Initial"
          colorScheme="blue"
          variant="outlined"
        />
        <Tag
          label="Blue Outlined · Selected"
          colorScheme="blue"
          variant="outlined"
          isActive
        />
        <Tag
          label="Grey Outlined · Initial"
          colorScheme="grey"
          variant="outlined"
        />
        <Tag
          label="Grey Outlined · Selected"
          colorScheme="grey"
          variant="outlined"
          isActive
        />
        <Tag
          label="Emerald Outlined · Initial"
          colorScheme="emerald"
          variant="outlined"
        />
        <Tag
          label="Emerald Outlined · Selected"
          colorScheme="emerald"
          variant="outlined"
          isActive
        />
        <Tag
          label="Orange Outlined · Initial"
          colorScheme="orange"
          variant="outlined"
        />
        <Tag
          label="Orange Outlined · Selected"
          colorScheme="orange"
          variant="outlined"
          isActive
        />
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  args: {
    onRemove: fn(),
  },
  render: (args) => (
    <div style={column}>
      <div style={row}>
        <Tag label="Favorite" startIcon={<RiStarLine />} colorScheme="blue" />
        <Tag label="Like" startIcon={<RiHeartLine />} colorScheme="blue" />
        <Tag label="Verified" startIcon={<RiCheckLine />} colorScheme="grey" />
        <Tag
          label="Trending"
          startIcon={<RiFireLine />}
          colorScheme="blue"
          variant="outlined"
        />
        <Tag
          label="User"
          startIcon={<RiUserLine />}
          colorScheme="grey"
          variant="outlined"
        />
      </div>
      <div style={row}>
        <Tag
          label="With End Icon"
          endIcon={<RiStarLine />}
          colorScheme="blue"
        />
        <Tag
          label="Both Icons"
          startIcon={<RiUserLine />}
          endIcon={<RiCheckLine />}
          colorScheme="grey"
        />
        <Tag
          label="Removable"
          startIcon={<RiFireLine />}
          colorScheme="blue"
          variant="outlined"
          onRemove={args.onRemove}
        />
      </div>
    </div>
  ),
}

/** "Show more" / "Show less" are outlined tags with a +/- trailing icon. */
export const ShowMore: Story = {
  render: () => (
    <div style={row}>
      <Tag
        label="Show more"
        variant="outlined"
        colorScheme="blue"
        endIcon={<RiAddLine />}
      />
      <Tag
        label="Show less"
        variant="outlined"
        colorScheme="blue"
        endIcon={<RiSubtractLine />}
      />
      <Tag
        label="Show more"
        variant="outlined"
        colorScheme="grey"
        endIcon={<RiAddLine />}
      />
      <Tag
        label="Show less"
        variant="outlined"
        colorScheme="grey"
        endIcon={<RiSubtractLine />}
      />
    </div>
  ),
}

export const Clickable: Story = {
  args: {
    onClick: fn(),
    onRemove: fn(),
  },
  render: (args) => (
    <div style={row}>
      <Tag label="Clickable" onClick={args.onClick} />
      <Tag
        label="Clickable with Remove"
        onClick={args.onClick}
        onRemove={args.onRemove}
      />
    </div>
  ),
}
