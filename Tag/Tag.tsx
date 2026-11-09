'use client'

import { ComponentProps, ReactNode } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'
import { IconButton } from '../IconButton/IconButton'
import styles from './Tag.module.scss'

export type TagVariant = 'filled' | 'outlined'
export type TagSize = 'small' | 'medium' | 'big'
export type TagColorScheme = 'blue' | 'grey' | 'emerald' | 'orange'

export interface TagProps extends Omit<ComponentProps<'div'>, 'color'> {
  variant?: TagVariant
  size?: TagSize
  colorScheme?: TagColorScheme
  label?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
  onRemove?: () => void
  /** Renders the "Selected" state (solid fill, white text). */
  isActive?: boolean
}

export const Tag = ({
  variant = 'filled',
  size = 'medium',
  colorScheme = 'blue',
  label,
  startIcon,
  endIcon,
  onRemove,
  isActive = false,
  className,
  onClick,
  ...props
}: TagProps) => {
  const { t } = useTranslation('ui-kit')

  const rootClassName = cn(
    styles.root,
    styles[variant],
    styles[colorScheme],
    styles[`size_${size}`],
    {
      [styles.selected]: isActive,
      [styles.clickable]: Boolean(onClick),
    },
    className,
  )

  const content = (
    <>
      {startIcon && <span className={styles.icon}>{startIcon}</span>}
      {label != null && <span className={styles.label}>{label}</span>}
      {endIcon && <span className={styles.icon}>{endIcon}</span>}
    </>
  )

  const remove = onRemove && (
    <IconButton
      size="small"
      colorScheme="grey"
      className={styles.remove}
      aria-label={t('common.button.remove')}
      onClick={(e) => {
        e.stopPropagation()
        onRemove()
      }}
    >
      <RiCloseLine aria-hidden />
    </IconButton>
  )

  if (!onClick) {
    return (
      <div className={rootClassName} {...props}>
        {content}
        {remove}
      </div>
    )
  }

  // onClick is typed for a div (TagProps); at runtime the target is the button.
  const onButtonClick =
    onClick as unknown as ComponentProps<'button'>['onClick']

  if (!remove) {
    return (
      <button
        type="button"
        className={cn(rootClassName, styles.button)}
        onClick={onButtonClick}
        {...(props as ComponentProps<'button'>)}
      >
        {content}
      </button>
    )
  }

  // A button can't hold the remove button, so the body and the remove control are siblings.
  return (
    <div className={cn(rootClassName, styles.split)} {...props}>
      <button
        type="button"
        className={cn(styles.button, styles.body)}
        onClick={onButtonClick}
      >
        {content}
      </button>
      {remove}
    </div>
  )
}
