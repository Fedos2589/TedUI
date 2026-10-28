'use client'

import { ReactNode } from 'react'
import styles from './styles.module.scss'
import { RiArrowLeftSLine, RiMenuLine } from '@remixicon/react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Typography } from '../Typography'

export interface NavMobileHeaderProps {
  title?: string
  onBack?: () => void
  className?: string
  showMenuIcon?: boolean
  onMenuClick?: () => void
  rightContent?: ReactNode
  hideBackButton?: boolean
  align?: 'center' | 'left'
}

export const NavMobileHeader = ({
  title,
  onBack,
  className,
  showMenuIcon,
  onMenuClick,
  rightContent,
  hideBackButton = false,
  align = 'center',
}: NavMobileHeaderProps) => {
  const { t } = useTranslation('ui-kit')
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // Native equivalent of next/router's `router.back()` (which just calls
      // this under the hood) — keeps UI-KIT free of next/router.
      window.history.back()
    }
  }

  return (
    <div
      className={classNames(
        styles.header,
        align === 'left' && styles.alignLeft,
        !rightContent && styles.noRightContent,
        className,
      )}
    >
      {!hideBackButton && (
        <button
          type="button"
          className={styles.backButton}
          aria-label={
            showMenuIcon ? t('common.action.menu') : t('common.action.back')
          }
          onClick={showMenuIcon ? onMenuClick : handleBack}
        >
          {showMenuIcon ? (
            <RiMenuLine size={24} aria-hidden />
          ) : (
            <RiArrowLeftSLine size={24} aria-hidden />
          )}
        </button>
      )}
      {!!title && (
        <Typography
          className={styles.title}
          textAlign={align}
          variant={'h6'}
          color={'black'}
        >
          {title}
        </Typography>
      )}
      {!!rightContent && (
        <div className={styles.rightContent}>{rightContent}</div>
      )}
    </div>
  )
}
