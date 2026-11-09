'use client'

import { useTranslation } from 'react-i18next'
import styles from './Bullet.module.scss'
import {
  RemixiconComponentType,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
} from '@remixicon/react'
import cn from 'classnames'
import type { ColorToken } from '../colors'
import { Typography } from '../Typography'

export type BulletState = 'empty' | 'ok' | 'not_ok'
export type BulletSize = 'small' | 'large'

const STATE_ICON: Record<BulletState, RemixiconComponentType> = {
  ok: RiCheckboxCircleFill,
  not_ok: RiCloseCircleFill,
  empty: RiCheckboxBlankCircleLine,
}

// Remix icons take their size as an SVG attribute.
const ICON_SIZE: Record<BulletSize, number> = { small: 14, large: 20 }

interface BulletProps {
  title: string
  /** Drives the leading icon. */
  state?: BulletState
  color?: ColorToken
  size?: BulletSize
}

export const Bullet = ({
  title,
  state = 'ok',
  color = 'bw-black',
  size = 'small',
}: BulletProps) => {
  const { t } = useTranslation('ui-kit')
  const Icon = STATE_ICON[state]
  const iconLabel = {
    ok: t('common.text.included'),
    not_ok: t('common.text.not_included'),
    empty: undefined,
  }[state]

  return (
    <Typography variant="t3" color={color} className={styles.container}>
      <Icon
        className={cn(styles.icon, styles[`icon_${size}`], styles[state])}
        size={ICON_SIZE[size]}
        role={iconLabel ? 'img' : undefined}
        aria-label={iconLabel}
        aria-hidden={iconLabel ? undefined : true}
      />
      {title}
    </Typography>
  )
}
