import {
  RiEyeLine,
  RiLockLine,
  RiMailLine,
  RiSearchLine,
} from '@remixicon/react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { Input } from './Input'

// Select-control → icon mapping. Storybook shows the keys in a dropdown and
// renders the mapped node, so startIcon/endIcon are toggleable from the panel.
const iconOptions = {
  None: undefined,
  Mail: <RiMailLine size={16} />,
  Search: <RiSearchLine size={16} />,
  Eye: <RiEyeLine size={16} />,
  Lock: <RiLockLine size={16} />,
}
const iconArgType = {
  control: 'select' as const,
  options: Object.keys(iconOptions),
  mapping: iconOptions,
}

const meta: Meta<typeof Input> = {
  title: 'UI-KIT/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'email@example.com',
    size: 'medium',
    colorScheme: 'white',
    disabled: false,
    error: false,
    required: false,
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
    startIcon: iconArgType,
    endIcon: iconArgType,
  },
}

export default meta
type Story = StoryObj<typeof Input>

// Fully driven by the controls panel — change anything and it updates live.
export const Playground: Story = {
  args: {
    label: 'Email',
    helperText: 'Lorem ipsum dolor sit amet',
  },
}

export const Error: Story = {
  args: {
    'aria-label': 'Email',
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
    placeholder: 'Enter email',
    startIcon: iconOptions.Mail,
    endIcon: iconOptions.Eye,
  },
}

// Showcase rows fix only `size`; every other control (colorScheme, icons,
// error, disabled…) is spread from args so the panel still drives them.
export const AllSizes: Story = {
  argTypes: { size: { table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input {...args} size="small" placeholder="Small size input" />
      <Input {...args} size="medium" placeholder="Medium size input" />
      <Input {...args} size="big" placeholder="Big size input" />
    </div>
  ),
}

// Showcase rows fix only `colorScheme`; the rest comes from args.
export const AllColorSchemes: Story = {
  argTypes: { colorScheme: { table: { disable: true } } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Input {...args} colorScheme="grey" placeholder="Grey color scheme" />
      <Input
        {...args}
        colorScheme="grey-blue"
        placeholder="Grey-blue color scheme"
      />
      <Input {...args} colorScheme="white" placeholder="White color scheme" />
      <Input {...args} colorScheme="beige" placeholder="Beige color scheme" />
    </div>
  ),
}
