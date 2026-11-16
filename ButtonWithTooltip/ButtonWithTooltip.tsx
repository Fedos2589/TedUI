'use client'

import {
  PropsWithChildren,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
} from 'react'
import cn from 'classnames'
import { Modal } from '../Modal'
import {
  Popover,
  type PopoverAlign,
  type PopoverSide,
} from '../Popover/Popover'
import useBreakpoints from '../hooks/useBreakpoints'
import styles from './styles.module.scss'

export interface ButtonWithTooltipProps {
  tooltipContent: ReactNode
  modalContent: ReactNode
  modalTitle?: string
  isOpen?: boolean
  tooltipSide?: PopoverSide
  tooltipAlign?: PopoverAlign
  onToggle?: () => void
  onClose?: () => void
  /**
   * Stretch the anchor to its container instead of hugging the trigger. The
   * wrapper chain is `inline-flex` by default, which is right for a floating
   * anchor and wrong when the trigger has to fill a row (a sidebar footer).
   */
  fullWidth?: boolean
}

export const ButtonWithTooltip = ({
  children,
  tooltipContent,
  modalContent,
  modalTitle,
  isOpen = false,
  tooltipSide,
  tooltipAlign,
  onToggle,
  onClose,
  fullWidth,
}: PropsWithChildren<ButtonWithTooltipProps>) => {
  const { isMobile: mobile } = useBreakpoints()
  const anchorRef = useRef<HTMLDivElement>(null)
  const popupId = useId()
  const desktopOpen = isOpen && !mobile

  const triggerSelector =
    ':is(button, a[href], [tabindex]):not([tabindex="-1"])'
  const focusTrigger = () =>
    anchorRef.current?.querySelector<HTMLElement>(triggerSelector)?.focus()

  // Focus goes back to the trigger only when the user closed the card from
  // inside (Escape) — an outside press means they are already going elsewhere.
  const returnFocus = useRef(false)
  useEffect(() => {
    if (!desktopOpen && returnFocus.current) {
      returnFocus.current = false
      focusTrigger()
    }
  }, [desktopOpen])

  return (
    <>
      <div
        ref={anchorRef}
        onClickCapture={(e) => {
          e.stopPropagation()
          onToggle?.()
        }}
        className={cn(styles.anchorInner, {
          [styles.anchorInnerFullWidth]: fullWidth,
        })}
      >
        {isValidElement<Record<string, unknown>>(children)
          ? cloneElement(children, {
              'aria-expanded': isOpen,
              'aria-haspopup': 'dialog',
              'aria-controls': desktopOpen ? popupId : undefined,
            })
          : children}
      </div>
      <Popover
        open={desktopOpen}
        onOpenChange={(open, { reason, event }) => {
          if (open) return
          // A press on the trigger is its own toggle (onClickCapture below).
          if (
            reason === 'outside-press' &&
            event.target instanceof Node &&
            anchorRef.current?.contains(event.target)
          )
            return
          if (reason === 'escape-key') returnFocus.current = true
          ;(onClose ?? onToggle)?.()
        }}
        anchor={anchorRef}
        id={popupId}
        aria-label={modalTitle}
        side={tooltipSide}
        align={tooltipAlign}
        className={styles.card}
      >
        {tooltipContent}
      </Popover>

      <Modal
        title={modalTitle}
        isVisible={isOpen && mobile}
        onClose={onClose ?? onToggle}
        finalFocus={() =>
          anchorRef.current?.querySelector<HTMLElement>(triggerSelector) ?? true
        }
      >
        {modalContent}
      </Modal>
    </>
  )
}
