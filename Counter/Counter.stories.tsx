import type { Meta, StoryObj } from '@storybook/react'
import { colorsUIKIT } from '../colors'
import { Typography } from '../Typography'
import { Counter } from './Counter'

const meta: Meta<typeof Counter> = {
  title: 'UI-KIT/Counter',
  component: Counter,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['S', 'M'] },
    variant: { control: { type: 'inline-radio' }, options: ['number', 'dot'] },
    colorScheme: {
      control: { type: 'inline-radio' },
      options: ['red', 'green', 'grey', 'white'],
    },
    count: { control: { type: 'number' } },
  },
}

export default meta
type Story = StoryObj<typeof Counter>

export const Default: Story = {
  args: { count: 1, size: 'M', variant: 'number' },
}

const Row = ({
  label,
  labelColor = 'greyscale.500',
  children,
}: {
  label: string
  labelColor?: string
  children: React.ReactNode
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Typography variant="t5" color={labelColor} style={{ width: 120 }}>
      {label}
    </Typography>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {children}
    </div>
  </div>
)

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Row label='size="M"'>
        <Counter count={1} size="M" />
        <Counter count={23} size="M" />
        <Counter count={456} size="M" />
        <Counter size="M" variant="dot" />
      </Row>
      <Row label='size="S"'>
        <Counter count={1} size="S" />
        <Counter count={23} size="S" />
        <Counter count={456} size="S" />
        <Counter size="S" variant="dot" />
      </Row>
    </div>
  ),
}

export const AllColorSchemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Row label='colorScheme="red"'>
        <Counter count={1} colorScheme="red" />
        <Counter count={23} colorScheme="red" />
        <Counter count={456} colorScheme="red" />
        <Counter variant="dot" colorScheme="red" />
      </Row>
      <Row label='colorScheme="red" S'>
        <Counter count={1} size="S" colorScheme="red" />
        <Counter count={23} size="S" colorScheme="red" />
        <Counter count={456} size="S" colorScheme="red" />
        <Counter variant="dot" size="S" colorScheme="red" />
      </Row>
      <Row label='colorScheme="green"'>
        <Counter count={1} colorScheme="green" />
        <Counter count={23} colorScheme="green" />
        <Counter count={456} colorScheme="green" />
        <Counter variant="dot" colorScheme="green" />
      </Row>
      <Row label='colorScheme="green" S'>
        <Counter count={1} size="S" colorScheme="green" />
        <Counter count={23} size="S" colorScheme="green" />
        <Counter count={456} size="S" colorScheme="green" />
        <Counter variant="dot" size="S" colorScheme="green" />
      </Row>
      <Row label='colorScheme="grey"'>
        <Counter count={1} colorScheme="grey" />
        <Counter count={23} colorScheme="grey" />
        <Counter count={456} colorScheme="grey" />
        <Counter variant="dot" colorScheme="grey" />
      </Row>
      {/* white sits on a colored surface — on the default light canvas it would
          be invisible */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 12,
          borderRadius: 12,
          background: colorsUIKIT.blue[300],
        }}
      >
        <Row label='colorScheme="white"' labelColor="greyscale.white">
          <Counter count={1} colorScheme="white" />
          <Counter count={23} colorScheme="white" />
          <Counter count={456} colorScheme="white" />
          <Counter variant="dot" colorScheme="white" />
        </Row>
        <Row label='colorScheme="white" S' labelColor="greyscale.white">
          <Counter count={1} size="S" colorScheme="white" />
          <Counter count={23} size="S" colorScheme="white" />
          <Counter count={456} size="S" colorScheme="white" />
          <Counter variant="dot" size="S" colorScheme="white" />
        </Row>
      </div>
    </div>
  ),
}
