import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../_storybook/Stack'
import { TitleBlock, TitleBlockSize } from './TitleBlock'

const meta: Meta<typeof TitleBlock> = {
  title: 'UI-KIT/TitleBlock',
  component: TitleBlock,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xxl', 'xl', 'l', 'm', 's', 'xs'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
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
type Story = StoryObj<typeof TitleBlock>

export const TitleOnly: Story = {
  args: {
    title: 'Headline without subtitle',
    size: 'l',
  },
}

export const AllSizes: Story = {
  render: () => {
    const sizes: TitleBlockSize[] = ['xxl', 'xl', 'l', 'm', 's', 'xs']
    return (
      <Stack direction="column" spacing={4} width={480}>
        {sizes.map((size) => (
          <Stack key={size} direction="column" spacing={1}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#545D6C' }}>
              size={size}
            </div>
            <TitleBlock size={size} title="Headline" subtitle="Subtitle" />
          </Stack>
        ))}
      </Stack>
    )
  },
}

export const RichTitle: Story = {
  args: {
    title: (
      <>
        Lorem ipsum dolor <span style={{ color: '#4959dc' }}>sit amet</span>{' '}
        consectetur adipiscing elit (sed do eiusmod)
      </>
    ),
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    size: 'l',
  },
}
