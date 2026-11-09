import type { ComponentProps } from 'react'
import cn from 'classnames'
import type { ColorToken } from '../colors'
import styles from './Spinner.module.scss'

export type SpinnerSize = 'small' | 'medium' | 'large'

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'color'> {
  size?: SpinnerSize
  // Without it the spinner takes `currentColor` — the text color of the busy control.
  color?: ColorToken
}

export const Spinner = ({
  size = 'large',
  color,
  className,
  ...props
}: SpinnerProps) => {
  // unnamed = decorative: in the kit it sits in a busy button or a status region
  const named = !!props['aria-label'] || !!props['aria-labelledby']

  return (
    <span
      role={named ? 'status' : undefined}
      aria-hidden={named ? undefined : true}
      className={cn(
        styles.spinner,
        styles[size],
        color && styles[`color-${color}`],
        className,
      )}
      {...props}
    />
  )
}
