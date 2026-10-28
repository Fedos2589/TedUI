import { ComponentProps } from 'react'
import cn from 'classnames'
import styles from './Spinner.module.scss'

export interface SpinnerProps extends ComponentProps<'span'> {
  /** Diameter, px. */
  size?: number
  /** Border thickness, px. Defaults to ~size/10 (min 2). */
  thickness?: number
}

export const Spinner = ({
  size = 20,
  thickness,
  className,
  style,
  ...props
}: SpinnerProps) => {
  // unnamed = decorative: in the kit it sits in a busy button or a status region
  const named = !!props['aria-label'] || !!props['aria-labelledby']

  return (
    <span
      role={named ? 'status' : undefined}
      aria-hidden={named ? undefined : true}
      className={cn(styles.spinner, className)}
      style={{
        width: size,
        height: size,
        borderWidth: thickness ?? Math.max(2, Math.round(size / 10)),
        ...style,
      }}
      {...props}
    />
  )
}
