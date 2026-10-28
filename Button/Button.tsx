'use client'

import { Button as BaseButton } from '@base-ui/react/button'
import { ComponentProps, ReactNode } from 'react'
import cn from 'classnames'
import { Spinner } from '../Spinner/Spinner'
import styles from './Button.module.scss'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'solid' | 'ghost'
export type ButtonColorScheme =
  | 'black'
  | 'grey'
  | 'white'
  | 'lightBlue'
  | 'blue'
  | 'red'
  | 'lightRed'
  | 'outline'

type ButtonAlign = 'left' | 'center' | 'right'

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  children: ReactNode
  size?: ButtonSize
  fullWidth?: boolean
  align?: ButtonAlign
  loading?: boolean
  variant?: ButtonVariant
  colorScheme?: ButtonColorScheme
}

const SPINNER_SIZE: Record<ButtonSize, number> = {
  small: 14,
  medium: 16,
  large: 20,
}

const blurTarget = (e: { currentTarget: EventTarget | null }) => {
  ;(e.currentTarget as HTMLButtonElement | null)?.blur()
}

export const Button = ({
  children,
  size = 'medium',
  variant = 'solid',
  colorScheme = 'black',
  className,
  fullWidth,
  align,
  loading,
  disabled,
  onClick,
  onPointerUp,
  onTouchEnd,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      className={cn(
        styles.button,
        styles[size],
        styles[variant],
        styles[colorScheme],
        className,
        { [styles.fullWidth]: fullWidth, [styles.loading]: loading },
        align && styles[`align_${align}`],
      )}
      onClick={(e) => {
        if (loading) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
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
      {loading ? (
        <>
          <span className={styles.contentHidden}>{children}</span>
          <span className={styles.spinner}>
            <Spinner size={SPINNER_SIZE[size]} />
          </span>
        </>
      ) : (
        children
      )}
    </BaseButton>
  )
}
