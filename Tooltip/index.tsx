'use client'

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import { ReactElement, ReactNode } from 'react'
import cn from 'classnames'
import styles from './Tooltip.module.scss'

export type TooltipTheme = 'light' | 'dark'

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

export interface TooltipProps {
  /** Tooltip content. */
  title: ReactNode
  /** Trigger element — a single element that can forward ref/props. */
  children: ReactElement
  /** Visual theme. `light` (default) = white card, `dark` = grey-600 card. */
  theme?: TooltipTheme
  placement?: TooltipPlacement
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
  /** Class applied to the popup. */
  className?: string
  /** Class applied to the trigger wrapper — e.g. to stop it hugging its content. */
  triggerClassName?: string
}

const parsePlacement = (placement: TooltipPlacement) => {
  const [side, align] = placement.split('-') as [
    'top' | 'bottom' | 'left' | 'right',
    ('start' | 'end')?,
  ]
  return { side, align: align ?? ('center' as const) }
}

export const Tooltip = ({
  title,
  children,
  theme = 'light',
  placement = 'bottom',
  arrow = false,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  delay = 200,
  sideOffset = 8,
  className,
  triggerClassName,
}: TooltipProps) => {
  const { side, align } = parsePlacement(placement)

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
          <span className={cn(styles.trigger, triggerClassName)}>
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
              styles[theme],
              { [styles.withArrow]: arrow },
              className,
            )}
          >
            {arrow && <BaseTooltip.Arrow className={styles.arrow} />}
            {title}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
