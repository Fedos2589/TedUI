'use client'

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { ComponentProps, useEffect, useRef } from 'react'
import cn from 'classnames'

import styles from './Combobox.module.scss'

export const ComboboxList = ({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.List>) => {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    requestAnimationFrame(() => {
      const selected = list.querySelector(
        '[data-selected]',
      ) as HTMLElement | null
      selected?.scrollIntoView({ block: 'center' })
    })
  }, [])

  return (
    <BaseCombobox.List
      ref={listRef}
      className={cn(styles.list, className)}
      {...props}
    />
  )
}

export const ComboboxItem = ({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Item>) => {
  return <BaseCombobox.Item className={cn(styles.item, className)} {...props} />
}

export const ComboboxEmpty = ({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Empty>) => {
  return (
    <BaseCombobox.Empty className={cn(styles.empty, className)} {...props} />
  )
}
