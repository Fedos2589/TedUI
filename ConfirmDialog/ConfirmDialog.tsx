'use client'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../Modal'
import { Typography } from '../Typography'

export interface ConfirmDialogProps {
  isVisible?: boolean
  title: string
  /** What the question is about — the record's name, the dates. */
  children?: ReactNode
  /** The action's own word («Delete»): it differs per question. */
  confirmLabel: string
  /** Defaults to the kit's translated «Cancel». */
  cancelLabel?: string
  /** `red` for an action that cannot be undone. */
  colorScheme?: 'black' | 'red'
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmDialog = ({
  isVisible,
  title,
  children,
  confirmLabel,
  cancelLabel,
  colorScheme = 'black',
  loading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const { t } = useTranslation('ui-kit')

  return (
    <Modal
      isVisible={isVisible}
      title={title}
      onClose={onClose}
      buttons={[
        {
          variant: 'ghost',
          colorScheme: 'grey',
          type: 'button',
          children: cancelLabel ?? t('button.cancel'),
          onClick: onClose,
        },
        {
          variant: 'solid',
          colorScheme,
          type: 'button',
          loading,
          children: confirmLabel,
          onClick: onConfirm,
        },
      ]}
    >
      {children && (
        <Typography variant="t3" component="p">
          {children}
        </Typography>
      )}
    </Modal>
  )
}
