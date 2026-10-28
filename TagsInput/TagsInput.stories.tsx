import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { TagsInput, TagsInputProps } from './TagsInput'

const meta: Meta<typeof TagsInput> = {
  title: 'UI-KIT/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'big'] },
    colorScheme: {
      control: 'select',
      options: ['grey', 'grey-blue', 'white', 'beige'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
}

export default meta

const Controlled = ({
  value: initial = [],
  ...props
}: Partial<TagsInputProps>) => {
  const [value, setValue] = useState<string[]>(initial)
  return (
    <div style={{ width: 330 }}>
      <TagsInput
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next)
          props.onChange?.(next)
        }}
      />
    </div>
  )
}

type Story = StoryObj<typeof TagsInput>

export const Default: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Tags"
      placeholder="Add a tag"
      value={['Lorem', 'Ipsum']}
    />
  ),
}

export const Empty: Story = {
  render: (args) => (
    <Controlled {...args} label="Tags" placeholder="Add a tag" />
  ),
}

export const Wrapping: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Tags"
      placeholder="Add a tag"
      value={[
        'Lorem ipsum',
        'Dolor',
        'Sit amet',
        'Consectetur',
        'Adipiscing elit',
      ]}
    />
  ),
}

export const WithMaxTags: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Tags"
      placeholder="Add a tag"
      helperText="Up to 3 tags"
      maxTags={3}
      value={['Lorem', 'Ipsum']}
    />
  ),
}

export const WithError: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Tags"
      placeholder="Add a tag"
      error
      errorText="Pick at least one tag"
    />
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <Controlled {...args} label="Tags" disabled value={['Lorem', 'Ipsum']} />
  ),
}
