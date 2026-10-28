'use client'

import { useTranslation } from 'react-i18next'
import { Typography } from '../Typography'
import {
  AvatarsRowItem,
  type AvatarsRowItemData,
  type AvatarsRowStackOrder,
} from './AvatarsRowItem/AvatarsRowItem'
import styles from './AvatarsRow.module.scss'

export interface AvatarsRowProps {
  data: AvatarsRowItemData[]
  borderColor?: string
  faded?: boolean
  // Cap the number of visible avatars; the rest collapse into a trailing "+N"
  // chip styled to match the avatars. Omit to show every item (default).
  max?: number
  // Which end stacks on top (default 'first' = leftmost on top).
  topmost?: AvatarsRowStackOrder
  // Animate each newly-added avatar in (default off).
  animateOnAdd?: boolean
  // Only items at this index and later animate; earlier ones render instantly.
  // Lets a consumer skip re-animating already-shown avatars (e.g. after a page
  // reload mid-stream). Default 0 = all animate. Only applies with animateOnAdd.
  animateFromIndex?: number
}

export const AvatarsRow = ({
  data,
  borderColor,
  faded,
  max,
  topmost = 'first',
  animateOnAdd = false,
  animateFromIndex = 0,
}: AvatarsRowProps) => {
  const { t } = useTranslation('ui-kit')

  if (!data.length) {
    return null
  }

  const visible = max != null ? data.slice(0, max) : data
  const overflow = max != null ? Math.max(0, data.length - max) : 0
  const total = visible.length + (overflow > 0 ? 1 : 0)
  const chipSize = visible[visible.length - 1]?.size ?? 40

  return (
    <div
      className={styles.avatars}
      role="group"
      aria-label={t('common.text.people_count', '{{count}} people', {
        count: data.length,
      })}
    >
      {visible.map((item, index) => (
        <AvatarsRowItem
          key={index}
          data={item}
          index={index}
          total={total}
          borderColor={borderColor}
          faded={faded}
          topmost={topmost}
          animate={animateOnAdd && index >= animateFromIndex}
        />
      ))}
      {overflow > 0 && (
        <div
          className={styles.overflow}
          role="img"
          aria-label={t('common.text.more_count', '{{count}} more', {
            count: overflow,
          })}
          style={{
            width: chipSize,
            height: chipSize,
            marginLeft: -chipSize / 3,
            zIndex: topmost === 'last' ? visible.length + 1 : 0,
            borderRadius: Math.round(chipSize * 0.22),
            ...(borderColor && {
              boxShadow: `0 0 0 ${chipSize >= 40 ? 3 : 2}px ${borderColor}`,
            }),
          }}
        >
          <Typography variant="t5" color="greyscale.500">
            +{overflow}
          </Typography>
        </div>
      )}
    </div>
  )
}
