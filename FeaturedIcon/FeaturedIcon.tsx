import { ReactNode } from 'react'
import cn from 'classnames'
import styles from './FeaturedIcon.module.scss'

export type FeaturedIconColor =
  'blue' | 'red' | 'grey' | 'white' | 'orange' | 'green'
export type FeaturedIconSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type FeaturedIconVariant = 'light' | 'solid'

export interface FeaturedIconProps {
  children: ReactNode
  color?: FeaturedIconColor
  size?: FeaturedIconSize
  variant?: FeaturedIconVariant
  className?: string
  'aria-hidden'?: boolean
}

export const FeaturedIcon = ({
  children,
  color = 'blue',
  size = 'xl',
  variant = 'light',
  className,
  ...props
}: FeaturedIconProps) => (
  <div
    className={cn(
      styles.featuredIcon,
      styles[`size_${size}`],
      styles[`variant_${variant}`],
      styles[`color_${color}`],
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
