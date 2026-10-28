'use client'

import { Dialog } from '@base-ui/react/dialog'
import { PropsWithChildren, ReactNode } from 'react'
import styles from './Modal.module.scss'
import classNames from 'classnames'
import { Button } from '../Button'
import type { ButtonProps } from '../Button'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton/IconButton'
import { RiArrowLeftSLine, RiCloseLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

export interface ModalProps {
  isVisible?: boolean
  title?: string
  /** Second line under the title — a summary of what the dialog is about. */
  subtitle?: ReactNode
  modalWrapperClassname?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  buttons?: ButtonProps[]
  /**
   * Content pinned to the start of the footer row, opposite the buttons — a
   * step indicator, a checkbox, a hint. Pushes the buttons to the end.
   */
  footerStart?: ReactNode
  /**
   * Stack the footer buttons instead of laying them out in a row (default).
   * Stacking also reverses them, so the last button — the primary/destructive
   * one, rightmost in a row — ends up on top and the dismissive one stays
   * closest to the thumb. Callers keep passing `buttons` in row order.
   */
  columnButtons?: boolean
  onBack?: () => void
  onClose?: () => void
  // dialog name when there is no visible `title`
  'aria-label'?: string
}

export const Modal = ({
  isVisible,
  children,
  title,
  subtitle,
  modalWrapperClassname,
  headerClassName,
  contentClassName,
  footerClassName,
  buttons,
  footerStart,
  columnButtons = false,
  onBack,
  onClose,
  'aria-label': ariaLabel,
}: PropsWithChildren<ModalProps>) => {
  const { t } = useTranslation('ui-kit')

  return (
    <Dialog.Root
      open={!!isVisible}
      onOpenChange={(open) => {
        if (!open) onClose?.()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.overlay} />
        <Dialog.Popup
          className={classNames(styles.modalWrapper, modalWrapperClassname)}
          aria-label={ariaLabel}
        >
          <div className={styles.modal}>
            <div className={classNames(styles.header, headerClassName)}>
              {onBack && (
                <IconButton
                  size="medium"
                  colorScheme="white"
                  aria-label={t('common.action.back')}
                  onClick={onBack}
                >
                  <RiArrowLeftSLine size={20} aria-hidden />
                </IconButton>
              )}
              <div className={styles.titleBlock}>
                <Dialog.Title render={<Typography variant="h4" align="left" />}>
                  {title}
                </Dialog.Title>
                {subtitle && (
                  <Typography variant="t5" align="left" color="greyscale.400">
                    {subtitle}
                  </Typography>
                )}
              </div>
              {onClose && (
                <Dialog.Close
                  render={
                    <IconButton
                      size="medium"
                      colorScheme="white"
                      aria-label={t('common.action.close')}
                    >
                      <RiCloseLine size={20} aria-hidden />
                    </IconButton>
                  }
                />
              )}
            </div>

            <Dialog.Description
              render={
                <div className={classNames(styles.content, contentClassName)} />
              }
            >
              {children}
            </Dialog.Description>

            {((buttons && buttons.length > 0) || footerStart) && (
              <div
                className={classNames(
                  styles.footer,
                  columnButtons && styles.footerColumn,
                  footerClassName,
                )}
              >
                {footerStart && (
                  <div className={styles.footerStart}>{footerStart}</div>
                )}
                {buttons?.map((button, index) => (
                  <Button key={index} {...button} />
                ))}
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
