import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Typography } from '../Typography'
import { TabsRounded, TabsRoundedColorScheme, TabsRoundedSize } from './index'

const meta: Meta<typeof TabsRounded> = {
  title: 'UI-KIT/TabsRounded',
  component: TabsRounded,
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
    colorScheme: {
      control: { type: 'inline-radio' },
      options: ['white', 'grey'],
    },
  },
  args: {
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof TabsRounded>

const TabsRoundedWithState = (args: any) => {
  const [value, setValue] = useState(args.value || args.data[0].value)

  return (
    <TabsRounded
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
  size: TabsRoundedSize
  data: { label: string; value: string }[]
  onChange?: (value: string) => void
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Typography variant="t5" color="greyscale.500">
      size=&quot;{size}&quot;
    </Typography>
    <TabsRoundedWithState size={size} data={data} onChange={onChange} />
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
      <TabsRoundedWithState {...args} />
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
      <TabsRoundedWithState {...args} />
    </div>
  ),
  args: {
    variant: 'fullWidth',
    size: 'medium',
    data: fourTabs,
  },
}

const SchemeBlock = ({
  colorScheme,
  data,
  onChange,
}: {
  colorScheme: TabsRoundedColorScheme
  data: { label: string; value: string }[]
  onChange?: (value: string) => void
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Typography variant="t5" color="greyscale.500">
      colorScheme=&quot;{colorScheme}&quot;
    </Typography>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TabsRoundedWithState
        size="big"
        colorScheme={colorScheme}
        data={data}
        onChange={onChange}
      />
      <TabsRoundedWithState
        size="medium"
        colorScheme={colorScheme}
        data={data}
        onChange={onChange}
      />
      <TabsRoundedWithState
        size="small"
        colorScheme={colorScheme}
        data={data}
        onChange={onChange}
      />
    </div>
  </div>
)

export const AllColorSchemes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <SchemeBlock
        colorScheme="grey"
        data={fiveTabs}
        onChange={args.onChange}
      />
      <SchemeBlock
        colorScheme="white"
        data={fiveTabs}
        onChange={args.onChange}
      />
    </div>
  ),
}

const disabledTabs = [
  { label: 'Active', value: 'a' },
  { label: 'Enabled', value: 'b' },
  { label: 'Disabled', value: 'c', disabled: true },
  { label: 'Disabled', value: 'd', disabled: true },
]

export const WithDisabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SchemeBlock
        colorScheme="grey"
        data={disabledTabs}
        onChange={args.onChange}
      />
      <SchemeBlock
        colorScheme="white"
        data={disabledTabs}
        onChange={args.onChange}
      />
    </div>
  ),
}

export const AllVariants: Story = {
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
        <TabsRoundedWithState
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
        <TabsRoundedWithState
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
        <TabsRoundedWithState
          variant="fullWidth"
          size="medium"
          data={fourTabs}
          onChange={args.onChange}
        />
      </div>
    </div>
  ),
}
