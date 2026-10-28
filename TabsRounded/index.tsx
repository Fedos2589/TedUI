'use client'

import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import classNames from 'classnames'
import { useState } from 'react'
import { Counter } from '../Counter/Counter'
import { Typography, TypographyVariant } from '../Typography/Typography'
import { AuraBadge } from './AuraBadge'
import styles from './styles.module.scss'

export type TabsRoundedSize = 'small' | 'medium' | 'big'
export type TabsRoundedVariant = 'standard' | 'scrollable' | 'fullWidth'
export type TabsRoundedColorScheme = 'white' | 'grey'

interface TabItem<V extends string> {
  label: string
  value: V
  badge?: number
  disabled?: boolean
}

export interface TabsRoundedProps<V extends string> {
  data: TabItem<V>[]
  value: V
  onChange: (value: V) => void
  size?: TabsRoundedSize
  variant?: TabsRoundedVariant
  colorScheme?: TabsRoundedColorScheme
  auraBadge?: boolean
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

const typographyVariantBySize: Record<TabsRoundedSize, TypographyVariant> = {
  small: 't3',
  medium: 'h6',
  big: 'h5',
}

const sizeClassName: Record<TabsRoundedSize, string> = {
  small: styles.size_small,
  medium: styles.size_medium,
  big: styles.size_big,
}

const variantClassName: Record<TabsRoundedVariant, string | undefined> = {
  standard: undefined,
  scrollable: styles.variant_scrollable,
  fullWidth: styles.variant_fullWidth,
}

const colorSchemeClassName: Record<TabsRoundedColorScheme, string> = {
  white: styles.scheme_white,
  grey: styles.scheme_grey,
}

export const TabsRounded = <V extends string>({
  data,
  value,
  onChange,
  size = 'medium',
  variant = 'standard',
  colorScheme = 'white',
  auraBadge,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: TabsRoundedProps<V>) => {
  const [isSecondTabHovered, setIsSecondTabHovered] = useState(false)

  return (
    <div
      className={classNames(
        styles.wrapper,
        sizeClassName[size],
        variantClassName[variant],
        colorSchemeClassName[colorScheme],
      )}
    >
      <AuraBadge isActive={auraBadge} isHovered={isSecondTabHovered} />
      <BaseTabs.Root
        value={value}
        onValueChange={(next) => onChange(next as V)}
        className={className}
      >
        <BaseTabs.List
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={styles.list}
        >
          {data.map((item, index) => (
            <BaseTabs.Tab
              key={item.value}
              value={item.value}
              className={styles.tab}
              disabled={item.disabled}
              onMouseEnter={
                index === 1 ? () => setIsSecondTabHovered(true) : undefined
              }
              onMouseLeave={
                index === 1 ? () => setIsSecondTabHovered(false) : undefined
              }
            >
              <Typography variant={typographyVariantBySize[size]}>
                {item.label}
              </Typography>
              {item.badge ? (
                <Counter
                  count={item.badge}
                  size="S"
                  colorScheme={item.value === value ? 'red' : 'grey'}
                />
              ) : null}
            </BaseTabs.Tab>
          ))}
          <BaseTabs.Indicator className={styles.indicator} />
        </BaseTabs.List>
      </BaseTabs.Root>
    </div>
  )
}
