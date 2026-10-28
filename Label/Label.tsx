import { CSSProperties, ReactNode } from 'react'
import cn from 'classnames'
import { Typography, TypographyVariant } from '../Typography/Typography'
import { colorsUIKIT } from '../colors'
import styles from './Label.module.scss'

export type LabelVariant = 'soft' | 'filled'
export type LabelColorScheme =
  'grey' | 'black' | 'blue' | 'green' | 'red' | 'orange'
export type LabelSize = 20 | 24 | 28 | 32 | 36 | 40

export interface LabelProps {
  label: ReactNode
  /** `soft` — tinted background + colored content; `filled` — solid background + white content. */
  variant?: LabelVariant
  colorScheme?: LabelColorScheme
  /** Pill height in px; controls radius, typography, icon size and padding. */
  size?: LabelSize
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
}

interface ColorTokens {
  /** background color */
  bg: string
  /** text + icon color */
  fg: string
  withShadow?: boolean
}

// Maps each colour scheme to UI-KIT palette tokens (see styles/constants.ts).
// `soft` = tinted background + colored content, `filled` = saturated background + white content.
const COLOR_STYLES: Record<
  LabelColorScheme,
  Record<LabelVariant, ColorTokens>
> = {
  grey: {
    soft: { bg: colorsUIKIT.greyscale[100], fg: colorsUIKIT.greyscale[500] },
    filled: { bg: colorsUIKIT.greyscale[500], fg: colorsUIKIT.greyscale.white },
  },
  black: {
    soft: {
      bg: colorsUIKIT.greyscale.white,
      fg: colorsUIKIT.greyscale[600],
      withShadow: true,
    },
    filled: {
      bg: colorsUIKIT.greyscale[600],
      fg: colorsUIKIT.greyscale.white,
      withShadow: true,
    },
  },
  blue: {
    soft: { bg: colorsUIKIT.greyBlue[100], fg: colorsUIKIT.blue[300] },
    filled: { bg: colorsUIKIT.blue[300], fg: colorsUIKIT.greyscale.white },
  },
  green: {
    soft: { bg: colorsUIKIT.green[50], fg: colorsUIKIT.green[400] },
    filled: { bg: colorsUIKIT.green[300], fg: colorsUIKIT.greyscale.white },
  },
  red: {
    soft: { bg: colorsUIKIT.red[50], fg: colorsUIKIT.red[300] },
    filled: { bg: colorsUIKIT.red[300], fg: colorsUIKIT.greyscale.white },
  },
  orange: {
    soft: { bg: colorsUIKIT.orange[50], fg: colorsUIKIT.orange[300] },
    filled: { bg: colorsUIKIT.orange[300], fg: colorsUIKIT.greyscale.white },
  },
}

const SIZE_CLASS: Record<LabelSize, string> = {
  20: styles.size20,
  24: styles.size24,
  28: styles.size28,
  32: styles.size32,
  36: styles.size36,
  40: styles.size40,
}

const SIZE_TYPOGRAPHY: Record<LabelSize, TypographyVariant> = {
  20: 't5',
  24: 't4',
  28: 't3',
  32: 't2',
  36: 't2',
  40: 'h6',
}

// Subtle elevation used by the `black` scheme — matches the Figma drop shadow
// (rgb(141, 152, 190) @ 6% opacity).
const SHADOW = '0px 2px 2px 0px rgba(141, 152, 190, 0.06)'

export const Label = ({
  label,
  variant = 'filled',
  colorScheme = 'grey',
  size = 28,
  startIcon,
  endIcon,
  className,
}: LabelProps) => {
  const color = COLOR_STYLES[colorScheme][variant]

  const style: CSSProperties = {
    backgroundColor: color.bg,
    color: color.fg,
    boxShadow: color.withShadow ? SHADOW : undefined,
  }

  return (
    <div className={cn(styles.tag, SIZE_CLASS[size], className)} style={style}>
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      <Typography variant={SIZE_TYPOGRAPHY[size]} color="inherit">
        {label}
      </Typography>
      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </div>
  )
}
