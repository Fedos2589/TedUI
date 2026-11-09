'use client'

import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { Typography } from '../Typography'
import cn from 'classnames'
import styles from './styles.module.scss'
import { Counter } from '../Counter/Counter'

export type TabSize = 'small' | 'medium' | 'big'
export type TabVariant = 'standard' | 'scrollable' | 'fullWidth'

interface TabItem {
  label: string
  value: string
  disabled?: boolean
  badge?: number
  dot?: boolean
}

export interface TabsProps {
  data: TabItem[]
  value: string
  onChange: (value: string) => void
  size?: TabSize
  variant?: TabVariant
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

const dotSizeClass: Record<TabSize, string> = {
  small: styles.dotSmall,
  medium: styles.dotMedium,
  big: styles.dotBig,
}

export const Tabs = ({
  data,
  value,
  onChange,
  size = 'medium',
  variant = 'standard',
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: TabsProps) => {
  const activeItem = data.find((item) => item.value === value)
  const isActiveDisabled = !!activeItem?.disabled

  return (
    <BaseTabs.Root value={value} onValueChange={onChange} className={className}>
      <BaseTabs.List
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(styles.list, {
          [styles.scrollable]: variant === 'scrollable',
          [styles.fullWidth]: variant === 'fullWidth',
        })}
      >
        {data.map((item) => {
          return (
            <BaseTabs.Tab
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className={cn(styles.tab, styles[size])}
            >
              <span className={styles.label}>
                <Typography
                  variant={size === 'big' ? 'h5' : 'h6'}
                  className={styles.labelText}
                >
                  {item.label}
                </Typography>
              </span>
              {item.badge ? (
                <Counter count={item.badge} />
              ) : item.dot ? (
                <span className={cn(styles.dot, dotSizeClass[size])} />
              ) : null}
            </BaseTabs.Tab>
          )
        })}
        <BaseTabs.Indicator
          className={cn(styles.indicator, {
            [styles.indicatorDisabled]: isActiveDisabled,
          })}
        />
      </BaseTabs.List>
    </BaseTabs.Root>
  )
}
