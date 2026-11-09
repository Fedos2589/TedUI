import { forwardRef } from 'react'
import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import cn from 'classnames'

import type { ColorToken } from '../colors'
import styles from './Typography.module.scss'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'h8'
  | 'bh1'
  | 'bh2'
  | 'bh3'
  | 'bh4'
  | 'bh5'
  | 'bh6'
  | 'bh7'
  | 't1'
  | 't2'
  | 't3'
  | 't4'
  | 't5'
  | 't6'

export interface TypographyProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'color'
> {
  variant?: TypographyVariant
  // A `--color-*` token name; applied as a class, never as an inline style.
  color?: ColorToken
  /** Element to render. Defaults to `span` (use for semantics, e.g. `component="h1"`). */
  component?: ElementType
  children?: ReactNode
}

// Plain text in one of the scale's variants, colored by a token. Alignment and spacing
// come from the caller's own class (`className`), which wins over the defaults in `.root`.
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 't1', color, component, className, children, ...rest }, ref) => {
    const Component = (component ?? 'span') as ElementType

    return (
      <Component
        ref={ref}
        className={cn(
          styles.root,
          styles[variant],
          color && styles[`color-${color}`],
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

Typography.displayName = 'Typography'
