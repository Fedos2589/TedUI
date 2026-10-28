import { forwardRef } from 'react'
import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react'

import cn from 'classnames'

import styles from './Typography.module.scss'
import { buildTypographyStyle } from './typographyStyle'

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
  /**
   * UI-KIT token path (`greyscale.500`, `blue.300`), a semantic name
   * (`primary`, `secondary`, …) or any raw CSS color. Resolved against the
   * UI-KIT tokens; unknown values pass through as-is.
   */
  color?: string
  /** Element to render. Defaults to `span` (use for semantics, e.g. `component="h1"`). */
  component?: ElementType
  align?: CSSProperties['textAlign'] | 'inherit'
  textAlign?: CSSProperties['textAlign']
  mb?: number | string
  mt?: number | string
  width?: number | string
  fontSize?: number | string
  fontWeight?: CSSProperties['fontWeight']
  textTransform?: CSSProperties['textTransform']
  whiteSpace?: CSSProperties['whiteSpace']
  children?: ReactNode
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 't1',
      color,
      component,
      className,
      children,
      align,
      textAlign,
      mb,
      mt,
      width,
      fontSize,
      fontWeight,
      textTransform,
      whiteSpace,
      style,
      ...rest
    },
    ref,
  ) => {
    const Component = (component ?? 'span') as ElementType

    const computedStyle = buildTypographyStyle({
      color,
      align,
      textAlign,
      mb,
      mt,
      width,
      fontSize,
      fontWeight,
      textTransform,
      whiteSpace,
      style,
    })

    return (
      <Component
        ref={ref}
        className={cn(styles.root, styles[variant], className)}
        style={computedStyle}
        {...rest}
      >
        {children}
      </Component>
    )
  },
)

Typography.displayName = 'Typography'
