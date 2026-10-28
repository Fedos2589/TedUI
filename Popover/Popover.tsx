'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import { ReactNode, RefObject } from 'react'
import cn from 'classnames'
import styles from './Popover.module.scss'

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverProps {
  /** Controlled open state. */
  open: boolean
  /** Fires on open/close — outside-press and Escape close the popover. */
  onOpenChange?: (open: boolean) => void
  /** Element (or ref) the popover is positioned against. */
  anchor: Element | RefObject<Element | null> | null
  children: ReactNode
  /** Side of the anchor to place the popover on. May flip to avoid collisions. */
  side?: PopoverSide
  /** Alignment along the chosen side. May shift/flip to stay in view. */
  align?: PopoverAlign
  /** Gap between anchor and popover, px. */
  sideOffset?: number
  /** Shift along the align axis, px. */
  alignOffset?: number
  /** Class on the popup (the floating card wrapper). */
  className?: string
  /** Class on the positioner element. */
  positionerClassName?: string
  /** Dimming backdrop behind the popover. */
  backdrop?: boolean
  /** Modal mode — traps focus and locks body scroll while open. */
  modal?: boolean
  /** Render a pointing arrow. */
  arrow?: boolean
  /** Keep the popover mounted (hidden) while closed. */
  keepMounted?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Anchored popover built on `@base-ui/react` (same foundation as `Tooltip`).
 * Headless positioning (flip/shift via floating-ui) with the visible styling
 * left to the consumer's `children` — pass any card content. No app / MUI /
 * emotion dependency.
 */
export const Popover = ({
  open,
  onOpenChange,
  anchor,
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  className,
  positionerClassName,
  backdrop = false,
  modal = false,
  arrow = false,
  keepMounted = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: PopoverProps) => {
  return (
    <BasePopover.Root
      open={open}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      modal={modal}
    >
      <BasePopover.Portal keepMounted={keepMounted}>
        {backdrop && <BasePopover.Backdrop className={styles.backdrop} />}
        <BasePopover.Positioner
          className={cn(styles.positioner, positionerClassName)}
          anchor={anchor}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          positionMethod="fixed"
        >
          <BasePopover.Popup
            className={cn(styles.popup, className)}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          >
            {arrow && <BasePopover.Arrow className={styles.arrow} />}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}
