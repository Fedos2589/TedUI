import type { Meta, StoryObj } from '@storybook/react'
import { AvatarsRow } from './index'
import { Typography } from '../Typography'

const SAMPLE_PEOPLE = [
  {
    first_name: 'Linda',
    last_name: 'Lovelace',
    src: 'https://i.pravatar.cc/150?img=5',
  },
  {
    first_name: 'Sasha',
    last_name: 'Grey',
    src: 'https://i.pravatar.cc/150?img=12',
  },
  {
    first_name: 'Riley',
    last_name: 'Reid',
    src: 'https://i.pravatar.cc/150?img=32',
  },
  {
    first_name: 'Lana',
    last_name: 'Rhoades',
    src: 'https://i.pravatar.cc/150?img=68',
  },
  {
    first_name: 'Mia',
    last_name: 'Khalifa',
    src: 'https://i.pravatar.cc/150?img=47',
  },
]

const meta: Meta<typeof AvatarsRow> = {
  title: 'UI-KIT/AvatarsRow',
  component: AvatarsRow,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AvatarsRow>

const SIZES = [16, 20, 24, 32, 40, 52, 60, 72, 100] as const

const getInitials = (person: { first_name: string; last_name: string }) => {
  const firstInitial = person.first_name.charAt(0).toUpperCase()
  const lastInitial = person.last_name.charAt(0).toUpperCase()
  return `${firstInitial}${lastInitial}`
}

const makeData = (size: number) =>
  SAMPLE_PEOPLE.map((person, index) => ({
    id: index,
    src: person.src,
    initials: getInitials(person),
    alt: `${person.first_name} ${person.last_name}`,
    size,
  }))

const makeInitialsData = (size: number) =>
  SAMPLE_PEOPLE.map((person, index) => ({
    id: index,
    initials: getInitials(person),
    alt: `${person.first_name} ${person.last_name}`,
    size,
  }))

export const Default: Story = {
  args: {
    data: makeData(40),
  },
}

export const WithBorder: Story = {
  args: {
    borderColor: '#4959DC',
    data: makeData(40),
  },
}

export const InitialsOnly: Story = {
  args: {
    data: makeInitialsData(40),
  },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((size) => (
        <div
          key={size}
          style={{ display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <Typography
            variant="t5"
            color="greyscale.400"
            style={{ width: 32, flexShrink: 0 }}
          >
            {size}
          </Typography>
          <AvatarsRow data={makeData(size)} />
        </div>
      ))}
    </div>
  ),
}

export const AllSizesWithBorder: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        backgroundColor: '#4959DC',
        borderRadius: 12,
      }}
    >
      {SIZES.map((size) => (
        <div
          key={size}
          style={{ display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <Typography
            variant="t5"
            color="greyscale.white"
            style={{ width: 32, flexShrink: 0 }}
          >
            {size}
          </Typography>
          <AvatarsRow borderColor="#4959DC" data={makeData(size)} />
        </div>
      ))}
    </div>
  ),
}
