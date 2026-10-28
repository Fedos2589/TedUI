import cn from 'classnames'
import { Avatar, type AvatarProps, type AvatarSize } from '../../Avatar/Avatar'
import styles from './AvatarsRowItem.module.scss'

const SUPPORTED_SIZES = [16, 20, 24, 32, 40, 52, 60, 72, 100] as const

const FADE_OPACITIES = [0, 0, 0.3, 0.4, 0.6, 0.8, 0.9] as const
const FADE_OPACITY_MAX = 0.9

function snapToAvatarSize(n: number): AvatarSize {
  const closest = SUPPORTED_SIZES.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev,
  )
  return String(closest) as AvatarSize
}

// Which end of the row stacks on top: 'first' (leftmost on top — the default) or
// 'last' (rightmost on top, each avatar overlapping the one to its left).
export type AvatarsRowStackOrder = 'first' | 'last'

export interface AvatarsRowItemData extends Omit<AvatarProps, 'size'> {
  id?: number | string
  size?: number
}

interface AvatarsRowItemProps {
  data: AvatarsRowItemData
  index: number
  total: number
  borderColor?: string
  faded?: boolean
  topmost?: AvatarsRowStackOrder
  animate?: boolean
}

export const AvatarsRowItem = ({
  data,
  index,
  total,
  borderColor,
  faded,
  topmost = 'first',
  animate = false,
}: AvatarsRowItemProps) => {
  const { size = 40, ...avatar } = data
  const fadeOpacity =
    faded && borderColor ? (FADE_OPACITIES[index] ?? FADE_OPACITY_MAX) : 0

  return (
    <div
      className={cn(
        styles.item,
        animate && (index === 0 ? styles.animatedFirst : styles.animatedRest),
      )}
      style={{
        marginLeft: index === 0 ? 0 : -size / 3,
        zIndex: topmost === 'last' ? index + 1 : total - index,
        ...(borderColor && {
          borderRadius: Math.round(size * 0.22),
          boxShadow: `0 0 0 ${size >= 40 ? 3 : 2}px ${borderColor}`,
        }),
      }}
    >
      <Avatar {...avatar} size={snapToAvatarSize(size)} />
      {fadeOpacity > 0 && (
        <div
          className={styles.fade}
          style={{ backgroundColor: borderColor, opacity: fadeOpacity }}
        />
      )}
    </div>
  )
}
