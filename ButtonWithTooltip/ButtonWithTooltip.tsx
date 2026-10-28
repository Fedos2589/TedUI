'use client'

import {
  PropsWithChildren,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useRef,
} from 'react'
import cn from 'classnames'
import { Tooltip, TooltipProps } from '../Tooltip'
import { Modal, ModalProps } from '../Modal'
import useBreakpoints from '../hooks/useBreakpoints'
import { useOutsideClick } from '../hooks/useOutsideClick'
import styles from './styles.module.scss'

export interface ButtonWithTooltipProps {
  tooltipContent: ReactNode
  modalContent: ReactNode
  modalTitle?: string
  modalProps?: Omit<ModalProps, 'isVisible' | 'onClose' | 'children'>
  isOpen?: boolean
  tooltipProps?: Partial<TooltipProps>
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
  modalProps,
  isOpen = false,
  tooltipProps,
  onToggle,
  onClose,
  fullWidth,
}: PropsWithChildren<ButtonWithTooltipProps>) => {
  const { isMobile: mobile } = useBreakpoints()
  const anchorRef = useRef<HTMLDivElement>(null)
  const popupId = useId()
  const desktopOpen = isOpen && !mobile

  // Desktop only: an outside press closes the tooltip. Clicks inside the
  // portaled tooltip content are kept open by calling
  // `stopImmediatePropagation()` on the *native* event below — React's
  // synthetic `stopPropagation` would not stop the native event from reaching
  // the hook's document listener.
  const close = useCallback(() => onClose?.(), [onClose])
  useOutsideClick(anchorRef, close, !mobile && isOpen)

  return (
    <>
      <Tooltip
        title={
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- only keeps a press inside the tooltip from reaching the outside-click listener
          <div
            id={popupId}
            onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
          >
            {tooltipContent}
          </div>
        }
        open={isOpen && !mobile}
        triggerClassName={cn({ [styles.triggerFullWidth]: fullWidth })}
        {...tooltipProps}
      >
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
                'aria-controls': desktopOpen ? popupId : undefined,
              })
            : children}
        </div>
      </Tooltip>

      <Modal
        {...modalProps}
        title={modalTitle}
        isVisible={isOpen && mobile}
        onClose={onClose ?? onToggle}
      >
        {modalContent}
      </Modal>
    </>
  )
}
