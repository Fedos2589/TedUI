import type { ReactNode } from 'react'
import cn from 'classnames'
import { Typography, TypographyVariant } from '../Typography/Typography'
import styles from './Label.module.scss'

export type LabelVariant = 'soft' | 'filled'
export type LabelColorScheme =
  'grey' | 'black' | 'blue' | 'green' | 'red' | 'orange'
export type LabelSize = 20 | 24 | 28 | 32 | 36 | 40

export interface LabelProps {
  label: ReactNode
  /** `soft` — tinted background + colored content; `filled` — solid background + white content. */
  variant?: LabelVariant
  colorScheme?: LabelColorScheme
  /** Pill height in px; controls radius, typography, icon size and padding. */
  size?: LabelSize
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
}

const SIZE_CLASS: Record<LabelSize, string> = {
  20: styles.size20,
  24: styles.size24,
  28: styles.size28,
  32: styles.size32,
  36: styles.size36,
  40: styles.size40,
}

const SIZE_TYPOGRAPHY: Record<LabelSize, TypographyVariant> = {
  20: 't5',
  24: 't4',
  28: 't3',
  32: 't2',
  36: 't2',
  40: 'h6',
}

export const Label = ({
  label,
  variant = 'filled',
  colorScheme = 'grey',
  size = 28,
  startIcon,
  endIcon,
  className,
}: LabelProps) => {
  return (
    <div
      className={cn(
        styles.tag,
        SIZE_CLASS[size],
        styles[`${colorScheme}_${variant}`],
        className,
      )}
    >
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      <Typography variant={SIZE_TYPOGRAPHY[size]} className={styles.text}>
        {label}
      </Typography>
      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </div>
  )
}
