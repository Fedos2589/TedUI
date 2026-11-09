import type { ComponentPropsWithoutRef } from 'react'
import cn from 'classnames'
import styles from './Skeleton.module.scss'

export type SkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular'
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

// Size is layout: the caller sets width and height through `className`.
export interface SkeletonProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
}

export const Skeleton = ({
  variant = 'text',
  animation = 'pulse',
  className,
  ...rest
}: SkeletonProps) => (
  <span
    aria-hidden
    className={cn(
      styles.root,
      styles[variant],
      animation !== 'none' && styles[animation],
      className,
    )}
    {...rest}
  />
)
