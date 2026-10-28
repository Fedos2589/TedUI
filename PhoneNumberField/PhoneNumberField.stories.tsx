import type { Meta, StoryObj } from '@storybook/react'
import { ComponentProps, useState } from 'react'
import { fn } from 'storybook/test'
import type { Country } from 'react-phone-number-input'
import { Typography } from '../Typography'
import { PhoneNumberField } from './PhoneNumberField'
import { DEFAULT_COUNTRY, toE164 } from './countries'

const meta: Meta<typeof PhoneNumberField> = {
  title: 'UI-KIT/PhoneNumberField',
  component: PhoneNumberField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onCountryChange: fn(),
    onNationalNumberChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof PhoneNumberField>

const Demo = ({
  initialCountry = DEFAULT_COUNTRY,
  initialNumber = '',
  error,
  errorText,
  disabled,
  onCountryChange,
  onNationalNumberChange,
}: Partial<ComponentProps<typeof PhoneNumberField>> & {
  initialCountry?: Country
  initialNumber?: string
}) => {
  const [country, setCountry] = useState<Country>(initialCountry)
  const [nationalNumber, setNationalNumber] = useState(initialNumber)

  return (
    <div style={{ width: '400px' }}>
      <PhoneNumberField
        country={country}
        nationalNumber={nationalNumber}
        onCountryChange={(v) => {
          setCountry(v)
          onCountryChange?.(v)
        }}
        onNationalNumberChange={(v) => {
          setNationalNumber(v)
          onNationalNumberChange?.(v)
        }}
        error={error}
        errorText={errorText}
        disabled={disabled}
      />
      <Typography variant="t4" color="greyscale.400">
        {toE164(country, nationalNumber)}
      </Typography>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
}

export const Filled: Story = {
  render: (args) => (
    <Demo {...args} initialCountry="GB" initialNumber="20 7183 8750" />
  ),
}

export const WithError: Story = {
  render: (args) => (
    <Demo
      {...args}
      initialNumber="415 892 70 04"
      error
      errorText="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    />
  ),
}

export const Disabled: Story = {
  render: (args) => <Demo {...args} initialNumber="415 892 70 04" disabled />,
}

// The country picker becomes a bottom-sheet with a search field under 768px —
// resize the preview (or use a mobile viewport) to see it.
export const MobilePicker: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => <Demo {...args} />,
}
