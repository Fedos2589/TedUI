import { ComponentPropsWithoutRef, CSSProperties } from 'react'
import cn from 'classnames'
import styles from './Skeleton.module.scss'

export type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular'
export type SkeletonAnimation = 'pulse' | 'wave' | false

export interface SkeletonProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  /** Shape of the placeholder. Mirrors MUI's `variant`. */
  variant?: SkeletonVariant
  /** Width of the skeleton. A number is interpreted as `px`. */
  width?: number | string
  /** Height of the skeleton. A number is interpreted as `px`. */
  height?: number | string
  /** Animation type. Pass `false` to disable. Mirrors MUI's `animation`. */
  animation?: SkeletonAnimation
}

/**
 * Loading placeholder, API-compatible with MUI's `Skeleton` for the props the
 * project relies on (`variant`, `width`, `height`, `animation`, `className`,
 * `style`). Built on a native `<span>` + CSS — no MUI / emotion dependency.
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...rest
}: SkeletonProps) => {
  const dimensionStyle: CSSProperties = { width, height, ...style }

  return (
    <span
      aria-hidden
      className={cn(
        styles.root,
        styles[variant],
        animation && styles[animation],
        className,
      )}
      style={dimensionStyle}
      {...rest}
    />
  )
}
