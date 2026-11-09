import { ReactNode } from 'react'
import type {
  InputColorScheme,
  InputSize,
} from '../Input/InputShell/InputShell'

export type DatePickerView = 'year' | 'month' | 'day'

/** Both endpoints in the stored `YYYY-MM-DD` format; `''` means "not picked". */
export interface DateRangeValue {
  from: string
  to: string
}

interface DatePickerBaseProps {
  minDate?: string
  maxDate?: string
  /** Steps the picker walks, coarsest first. The last one commits the value. */
  views?: DatePickerView[]
  /** Language code for month and weekday names — falls back to the app's. */
  locale?: string
  disabled?: boolean
  error?: boolean
  errorText?: ReactNode
  placeholder?: string
  label?: ReactNode
  size?: InputSize
  colorScheme?: InputColorScheme
  startIcon?: ReactNode
  endIcon?: ReactNode
  /** Fires when the calendar opens — the hook consumers use to clear an error. */
  onOpen?: () => void
  className?: string
}

export type DatePickerProps =
  | (DatePickerBaseProps & {
      mode?: 'single'
      value?: string | null
      onChange: (value: string) => void
    })
  | (DatePickerBaseProps & {
      mode: 'range'
      value?: DateRangeValue | null
      onChange: (value: DateRangeValue) => void
    })
