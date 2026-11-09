'use client'

import { Button as BaseButton } from '@base-ui/react/button'
import { ComponentProps, ReactNode } from 'react'
import cn from 'classnames'
import styles from './IconButton.module.scss'

export type IconButtonSize = 'extraBig' | 'big' | 'medium' | 'small'
export type IconButtonColorScheme =
  'white' | 'grey' | 'whiteBlue' | 'greyBlue' | 'blue' | 'transparent'

type IconButtonProps = ComponentProps<typeof BaseButton> & {
  size?: IconButtonSize
  colorScheme?: IconButtonColorScheme
  loading?: boolean
  children: ReactNode
}

const blurTarget = (e: { currentTarget: EventTarget | null }) => {
  ;(e.currentTarget as HTMLButtonElement | null)?.blur()
}

export const IconButton = ({
  children,
  size = 'extraBig',
  colorScheme = 'grey',
  loading = false,
  className,
  disabled,
  onPointerUp,
  onTouchEnd,
  ...props
}: IconButtonProps) => (
  <BaseButton
    className={cn(
      styles.root,
      styles[`size_${size}`],
      styles[colorScheme],
      { [styles.loading]: loading },
      className,
    )}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    onPointerUp={(e) => {
      blurTarget(e)
      onPointerUp?.(e)
    }}
    onTouchEnd={(e) => {
      blurTarget(e)
      onTouchEnd?.(e)
    }}
    {...props}
  >
    {loading ? <span className={styles.spinner} /> : children}
  </BaseButton>
)
