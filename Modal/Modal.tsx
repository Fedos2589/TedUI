'use client'

import { Dialog } from '@base-ui/react/dialog'
import { ComponentProps, PropsWithChildren, ReactNode } from 'react'
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
  /** Id of the dialog — what a trigger's `aria-controls` points at. */
  id?: string
  /**
   * Where focus goes on close. Pass the opener's ref when it is a Button or
   * IconButton: they blur themselves on pointer release, so base-ui would
   * otherwise remember <body> as the opener.
   */
  finalFocus?: ComponentProps<typeof Dialog.Popup>['finalFocus']
  /** `alertdialog` for a question that needs an answer (ConfirmDialog). */
  role?: 'dialog' | 'alertdialog'
  // dialog name when there is no visible `title`
  'aria-label'?: string
}

export const Modal = ({
  isVisible,
  children,
  title,
  subtitle,
  buttons,
  footerStart,
  columnButtons = false,
  onBack,
  onClose,
  id,
  role = 'dialog',
  finalFocus,
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
          id={id}
          role={role}
          finalFocus={finalFocus}
          aria-modal="true"
          className={styles.modalWrapper}
          aria-label={ariaLabel}
        >
          <div className={styles.modal}>
            <div className={styles.header}>
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
                {title && (
                  <Dialog.Title
                    render={
                      <Typography
                        variant="h4"
                        component="h2"
                        className={styles.title}
                      />
                    }
                  >
                    {title}
                  </Dialog.Title>
                )}
                {subtitle && (
                  <Dialog.Description
                    render={
                      <Typography
                        variant="t5"
                        color="grey-400"
                        className={styles.subtitle}
                      />
                    }
                  >
                    {subtitle}
                  </Dialog.Description>
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

            <div className={styles.content}>{children}</div>

            {((buttons && buttons.length > 0) || footerStart) && (
              <div
                className={classNames(
                  styles.footer,
                  columnButtons && styles.footerColumn,
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
