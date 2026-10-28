import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Typography } from '../Typography'
import { Tabs, TabSize } from './index'

const meta: Meta<typeof Tabs> = {
  title: 'UI-KIT/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['small', 'medium', 'big'],
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['standard', 'scrollable', 'fullWidth'],
    },
  },
  args: {
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

const TabsWithState = (args: any) => {
  const [value, setValue] = useState(args.value || args.data[0].value)

  return (
    <Tabs
      {...args}
      value={value}
      onChange={(newValue: string) => {
        setValue(newValue)
        args.onChange?.(newValue)
      }}
    />
  )
}

const fiveTabs = [
  { label: 'Tab', value: 'a' },
  { label: 'Tab', value: 'b' },
  { label: 'Tab', value: 'c' },
  { label: 'Tab', value: 'd' },
  { label: 'Tab', value: 'e' },
]

const SizeRow = ({
  size,
  data,
  onChange,
}: {
  size: TabSize
  data: { label: string; value: string }[]
  onChange?: (value: string) => void
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Typography variant="t5" color="greyscale.500">
      size=&quot;{size}&quot;
    </Typography>
    <TabsWithState size={size} data={data} onChange={onChange} />
  </div>
)

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SizeRow size="big" data={fiveTabs} onChange={args.onChange} />
      <SizeRow size="medium" data={fiveTabs} onChange={args.onChange} />
      <SizeRow size="small" data={fiveTabs} onChange={args.onChange} />
    </div>
  ),
}

const dotTabs = [
  { label: 'Overview', value: 'a', dot: true },
  { label: 'Activity', value: 'b', dot: true },
  { label: 'Messages', value: 'c' },
]

export const WithDot: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SizeRow size="big" data={dotTabs} onChange={args.onChange} />
      <SizeRow size="medium" data={dotTabs} onChange={args.onChange} />
      <SizeRow size="small" data={dotTabs} onChange={args.onChange} />
    </div>
  ),
}

const manyTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Messages', value: 'messages' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Connections', value: 'connections' },
  { label: 'Saved', value: 'saved' },
  { label: 'Drafts', value: 'drafts' },
  { label: 'Archive', value: 'archive' },
  { label: 'Settings', value: 'settings' },
]

const fourTabs = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
]

export const Scrollable: Story = {
  render: (args) => (
    <div style={{ width: 360, border: '1px dashed #ccc', padding: 12 }}>
      <TabsWithState {...args} />
    </div>
  ),
  args: {
    variant: 'scrollable',
    size: 'medium',
    data: manyTabs,
  },
}

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: 480, border: '1px dashed #ccc', padding: 12 }}>
      <TabsWithState {...args} />
    </div>
  ),
  args: {
    variant: 'fullWidth',
    size: 'medium',
    data: fourTabs,
  },
}

export const AllVariants: Story = {
  args: {
    size: 'small',
    variant: 'scrollable',
  },

  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: 480,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="t5" color="greyscale.500">
          variant=&quot;standard&quot;
        </Typography>
        <TabsWithState
          variant="standard"
          size="medium"
          data={fourTabs}
          onChange={args.onChange}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="t5" color="greyscale.500">
          variant=&quot;scrollable&quot;
        </Typography>
        <TabsWithState
          variant="scrollable"
          size="medium"
          data={manyTabs}
          onChange={args.onChange}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Typography variant="t5" color="greyscale.500">
          variant=&quot;fullWidth&quot;
        </Typography>
        <TabsWithState
          variant="fullWidth"
          size="medium"
          data={fourTabs}
          onChange={args.onChange}
        />
      </div>
    </div>
  ),
}
