import classNames from 'classnames'
import { Typography } from '../Typography'
import styles from './Counter.module.scss'

export type CounterSize = 'S' | 'M'
export type CounterVariant = 'number' | 'dot'
export type CounterColorScheme = 'red' | 'green' | 'grey' | 'white'

const schemeStyles: Record<CounterColorScheme, string> = {
  red: styles.schemeRed,
  green: styles.schemeGreen,
  grey: styles.schemeGrey,
  white: styles.schemeWhite,
}

export interface CounterProps {
  count?: number
  size?: CounterSize
  variant?: CounterVariant
  colorScheme?: CounterColorScheme
  className?: string
}

export const Counter = ({
  count = 0,
  size = 'M',
  variant = 'number',
  colorScheme = 'red',
  className,
}: CounterProps) => {
  if (variant === 'dot') {
    return (
      <span
        className={classNames(
          styles.dot,
          size === 'S' ? styles.dotSmall : styles.dotMedium,
          schemeStyles[colorScheme],
          className,
        )}
      />
    )
  }

  return (
    <Typography
      variant={size === 'S' ? 'h8' : 'h7'}
      className={classNames(
        styles.counter,
        size === 'S' ? styles.sizeSmall : styles.sizeMedium,
        schemeStyles[colorScheme],
        className,
      )}
    >
      {count}
    </Typography>
  )
}
