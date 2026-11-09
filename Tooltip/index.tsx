'use client'

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import { ReactElement, ReactNode } from 'react'
import cn from 'classnames'
import type { PopoverAlign, PopoverSide } from '../Popover/Popover'
import styles from './Tooltip.module.scss'

export type TooltipColorScheme = 'light' | 'dark'

export interface TooltipProps {
  content: ReactNode
  /** Trigger element — a single element that can forward ref/props. */
  children: ReactElement
  /** `light` (default) = white card, `dark` = grey-600 card. */
  colorScheme?: TooltipColorScheme
  side?: PopoverSide
  align?: PopoverAlign
  arrow?: boolean
  /** Controlled open state. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  /** Hover open delay, ms. */
  delay?: number
  /** Distance between trigger and tooltip, px. */
  sideOffset?: number
  // The trigger wrapper hugs its child by default; this stretches it to the container.
  fullWidth?: boolean
  /** Class applied to the popup. */
  className?: string
}

export const Tooltip = ({
  content,
  children,
  colorScheme = 'light',
  side = 'bottom',
  align = 'center',
  arrow = false,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  delay = 200,
  sideOffset = 8,
  fullWidth,
  className,
}: TooltipProps) => {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <BaseTooltip.Trigger
        delay={delay}
        render={
          <span className={cn(styles.trigger, fullWidth && styles.fullWidth)}>
            {children}
          </span>
        }
      />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          className={styles.positioner}
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <BaseTooltip.Popup
            role="tooltip"
            className={cn(
              styles.popup,
              styles[colorScheme],
              { [styles.withArrow]: arrow },
              className,
            )}
          >
            {arrow && <BaseTooltip.Arrow className={styles.arrow} />}
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
