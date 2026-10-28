'use client'

import { useTranslation } from 'react-i18next'
import styles from './Bullet.module.scss'
import {
  RemixiconComponentType,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
} from '@remixicon/react'
import { colorsUIKIT } from '../colors'
import { Typography } from '../Typography'

export type BulletState = 'empty' | 'ok' | 'not_ok'

const STATE_CONFIG: Record<
  BulletState,
  { Icon: RemixiconComponentType; color: string }
> = {
  ok: { Icon: RiCheckboxCircleFill, color: '#37C269' },
  not_ok: { Icon: RiCloseCircleFill, color: '#FA7413' },
  empty: {
    Icon: RiCheckboxBlankCircleLine,
    color: colorsUIKIT.greyscale[400],
  },
}

interface BulletProps {
  title: string
  /** Drives the leading icon. */
  state?: BulletState
  color?: string
  size?: number
}

export const Bullet = ({
  title,
  state = 'ok',
  color = 'black',
  size = 14,
}: BulletProps) => {
  const { t } = useTranslation('ui-kit')
  const { Icon, color: iconColor } = STATE_CONFIG[state]
  const iconLabel = {
    ok: t('common.text.included'),
    not_ok: t('common.text.not_included'),
    empty: undefined,
  }[state]

  return (
    <Typography variant="t3" color={color} className={styles.container}>
      <Icon
        className={styles.icon}
        size={size}
        color={iconColor}
        style={{ marginTop: size <= 16 ? '3px' : 0 }}
        role={iconLabel ? 'img' : undefined}
        aria-label={iconLabel}
        aria-hidden={iconLabel ? undefined : true}
      />
      {title}
    </Typography>
  )
}
