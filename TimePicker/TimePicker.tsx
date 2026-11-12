'use client'

import { ChangeEvent } from 'react'

import { Input, InputProps } from '../Input/Input'

import { minutesToTime, timeToMinutes } from './timeValue'

export type TimePickerProps = Omit<
  InputProps,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'min'
  | 'max'
  | 'step'
  | 'children'
> & {
  /** Minutes after midnight; `null` is an empty field. */
  value: number | null
  onChange: (minutes: number | null) => void
  /** Minutes; the native input takes seconds. */
  step?: number
  min?: number
  max?: number
}

export function TimePicker({
  value,
  onChange,
  step,
  min,
  max,
  ...inputProps
}: TimePickerProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(timeToMinutes(event.target.value))

  return (
    <Input
      {...inputProps}
      type="time"
      value={minutesToTime(value)}
      onChange={handleChange}
      step={step == null ? undefined : step * 60}
      min={min == null ? undefined : minutesToTime(min)}
      max={max == null ? undefined : minutesToTime(max)}
    />
  )
}
