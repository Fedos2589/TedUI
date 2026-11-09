import { AvatarSize } from './Avatar'
import styles from './Avatar.module.scss'

export const SIZE_CLASS_MAP: Record<AvatarSize, string> = {
  '100': styles.size3xl,
  '72': styles.size2xl,
  '60': styles.sizeXl,
  '52': styles.sizeLg,
  '40': styles.sizeMd,
  '32': styles.sizeSm,
  '24': styles.sizeXs,
  '20': styles.size2xs,
  '16': styles.size3xs,
}

export const initialsVariantBySize = {
  '100': 'h1',
  '72': 'h3',
  '60': 'h4',
  '52': 'h4',
  '40': 'h5',
  '32': 'h6',
  '24': 't5',
  '20': 't5',
  '16': 't6',
}
