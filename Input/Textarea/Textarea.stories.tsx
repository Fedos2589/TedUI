import { RiAttachmentLine, RiChat1Line, RiSearchLine } from '@remixicon/react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Textarea } from './Textarea'

// Select-control → icon mapping, so startIcon/endIcon are toggleable from the
// controls panel (they map to `undefined` for "None").
const iconOptions = {
  None: undefined,
  Chat: <RiChat1Line size={16} />,
  Search: <RiSearchLine size={16} />,
  Attachment: <RiAttachmentLine size={16} />,
}
const iconArgType = {
  control: 'select' as const,
  options: Object.keys(iconOptions),
  mapping: iconOptions,
}

const meta: Meta<typeof Textarea> = {
  title: 'UI-KIT/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type your message...',
    size: 'medium',
    colorScheme: 'white',
    disabled: false,
    error: false,
    required: false,
    minRows: 3,
    onChange: fn(),
    onControlWrapperClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'big'],
    },
    colorScheme: {
      control: 'select',
      options: ['grey', 'grey-blue', 'white', 'beige'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    rows: { control: 'number' },
    minRows: { control: 'number' },
    maxRows: { control: 'number' },
    startIcon: iconArgType,
    endIcon: iconArgType,
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

// Fully driven by the controls panel — change anything and it updates live.
export const Playground: Story = {
  args: {
    label: 'Description',
    helperText: 'Lorem ipsum dolor sit amet',
  },
}

export const Error: Story = {
  args: {
    'aria-label': 'Bio',
    error: true,
    errorText: 'Lorem ipsum dolor sit amet',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot edit',
    value: 'Locked content',
    disabled: true,
  },
}

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search messages…',
    startIcon: iconOptions.Search,
    endIcon: iconOptions.Attachment,
  },
}

export const MinMaxRows: Story = {
  args: {
    placeholder: 'Grows from 3 to 10 rows',
    minRows: 3,
    maxRows: 10,
  },
}

// Showcase rows fix only `size`; every other control is spread from args.
export const AllSizes: Story = {
  argTypes: { size: { table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Textarea {...args} size="small" placeholder="Small textarea" />
      <Textarea {...args} size="medium" placeholder="Medium textarea" />
      <Textarea {...args} size="big" placeholder="Big textarea" />
    </div>
  ),
}

// Showcase rows fix only `colorScheme`; the rest comes from args.
export const AllColorSchemes: Story = {
  argTypes: { colorScheme: { table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Textarea {...args} colorScheme="grey" placeholder="Grey color scheme" />
      <Textarea
        {...args}
        colorScheme="grey-blue"
        placeholder="Grey-blue color scheme"
      />
      <Textarea
        {...args}
        colorScheme="white"
        placeholder="White color scheme"
      />
      <Textarea
        {...args}
        colorScheme="beige"
        placeholder="Beige color scheme"
      />
    </div>
  ),
}
