'use client'

import { useTranslation } from 'react-i18next'
import { Typography } from '../Typography'
import styles from './styles.module.scss'
import classNames from 'classnames'

interface AuraBadgeProps {
  isActive?: boolean
  isHovered?: boolean
}

export const AuraBadge = ({ isActive, isHovered }: AuraBadgeProps) => {
  const { t } = useTranslation('ui-kit')

  if (!isActive) {
    return null
  }

  return (
    <Typography
      variant="t5"
      color="greyscale.white"
      className={classNames(styles.auraBadge, isHovered && styles.hovered)}
    >
      {t('common.text.new')}
    </Typography>
  )
}
