import type { Meta, StoryObj } from '@storybook/react'
import { ReactNode, useState } from 'react'
import dayjs from 'dayjs'
import { Typography } from '../Typography'
import { DatePicker } from './DatePicker'
import type { DateRangeValue } from './DatePicker.types'

const meta: Meta<typeof DatePicker> = {
  title: 'UI-KIT/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof DatePicker>

const today = dayjs().format('YYYY-MM-DD')

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ width: 320 }}>{children}</div>
)

const SingleDemo = ({
  initial = '',
  ...rest
}: { initial?: string } & Partial<Parameters<typeof DatePicker>[0]>) => {
  const [value, setValue] = useState(initial)

  return (
    <Frame>
      <DatePicker
        {...rest}
        mode="single"
        value={value}
        onChange={setValue}
        label="Date"
        colorScheme="grey-blue"
      />
      <Typography variant="t5" color="greyscale.400" mt="8px">
        value: {value || '—'}
      </Typography>
    </Frame>
  )
}

const RangeDemo = (rest: Partial<Parameters<typeof DatePicker>[0]>) => {
  const [value, setValue] = useState<DateRangeValue>({ from: '', to: '' })

  return (
    <Frame>
      <DatePicker
        {...rest}
        mode="range"
        value={value}
        onChange={setValue}
        label="Dates"
        colorScheme="grey-blue"
      />
      <Typography variant="t5" color="greyscale.400" mt="8px">
        value: {value.from || '—'} → {value.to || '—'}
      </Typography>
    </Frame>
  )
}

/** Day, month and year — the full picker. Desktop commits the moment you pick. */
export const Single: Story = { render: () => <SingleDemo /> }

/**
 * Two picks make a range; a third starts a new one. Endpoints render as
 * selected, the days they span carry the range fill.
 */
export const Range: Story = { render: () => <RangeDemo /> }

/**
 * `views={['year', 'month']}` — what the work-experience dates need. There is
 * no day step, so picking the month commits the first of it.
 */
export const MonthAndYearOnly: Story = {
  render: () => <SingleDemo views={['year', 'month']} />,
}

/** Nothing after today can be picked, and the next-month arrow goes dead. */
export const NotInTheFuture: Story = {
  render: () => <SingleDemo maxDate={today} />,
}

/** Both bounds — the year list shrinks to the years they cover. */
export const Bounded: Story = {
  render: () => (
    <SingleDemo
      initial={dayjs().format('YYYY-MM-15')}
      minDate={dayjs().subtract(1, 'month').format('YYYY-MM-05')}
      maxDate={dayjs().add(1, 'month').format('YYYY-MM-20')}
    />
  ),
}

/** The error line comes from the Input shell, so it matches every other field. */
export const WithError: Story = {
  render: () => <SingleDemo error errorText="Please fill in this field" />,
}

export const Disabled: Story = {
  render: () => <SingleDemo initial={today} disabled />,
}

/** Month and weekday names follow the locale, not the app language. */
export const Localized: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SingleDemo initial={today} locale="ru" />
      <SingleDemo initial={today} locale="de" />
    </div>
  ),
}

/**
 * Below 768px the calendar becomes a bottom sheet: the month button opens the
 * year step, then the month step, and Apply commits the draft.
 */
export const MobileSheet: Story = {
  render: () => <SingleDemo />,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const MobileRangeSheet: Story = {
  render: () => <RangeDemo />,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
