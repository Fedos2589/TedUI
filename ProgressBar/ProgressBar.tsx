'use client'

import {
  CSSProperties,
  ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import styles from './ProgressBar.module.scss'

export type ProgressBarSize = 'thin' | 'small' | 'medium' | 'big'
export type ProgressBarColorScheme = 'blue' | 'green'

export interface ProgressBarProps {
  /** Current value. Use `0` to render the zero placeholder. */
  value: number
  /** Maximum value used to compute the fill percentage. */
  max: number
  /** Visual size of the bar. `thin` is the 8px track that carries no label. */
  size?: ProgressBarSize
  /** Fill color preset. */
  colorScheme?: ProgressBarColorScheme
  /**
   * Format the label rendered inside / next to the fill.
   * Receives the (unclamped) `value` prop. Defaults to `String(value)`.
   */
  format?: (value: number) => ReactNode
  /** Label shown when `value === 0`. */
  zeroPlaceholder?: ReactNode
  /**
   * Content rendered under the track. Nothing (and no gap) when omitted.
   * Wrap text in `Typography` — the Design System pairs T3 with the 24px
   * track and T4 with `thin`, both in `greyscale.400`.
   */
  caption?: ReactNode
  className?: string
  /** Accessible label, forwarded to the progressbar role. */
  'aria-label'?: string
  'aria-labelledby'?: string
  // defaults to the formatted label when `format` returns a string
  'aria-valuetext'?: string
}

// Right padding applied inside the fill when the label fits inside.
// Also doubles as the symmetric breathing room used by the inside/outside
// fit measurement.
const LABEL_INNER_GAP_PX = 8
// Gap between the right edge of the fill and the label when rendered outside.
const LABEL_OUTER_GAP_PX = 8
// Left padding for the zero placeholder.
const ZERO_PLACEHOLDER_LEFT_PX = 8

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max)

export const ProgressBar = ({
  value,
  max,
  size = 'small',
  colorScheme = 'green',
  format,
  zeroPlaceholder = '0',
  caption,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
}: ProgressBarProps) => {
  const captionId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const maxLabelRef = useRef<HTMLSpanElement>(null)

  // Measured once and on resize — used for the inside/outside fit check.
  // Using the widest possible label keeps the switch threshold stable so the
  // label doesn't oscillate as the rendered digits change.
  const [maxLabelWidth, setMaxLabelWidth] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)

  // The thin track is too short to hold text — the value lives in the caption.
  const showLabel = size !== 'thin'

  const isZero = value === 0
  const safeMax = max > 0 ? max : 0
  const percent = safeMax > 0 ? clamp((value / safeMax) * 100, 0, 100) : 0

  const labelContent = isZero
    ? zeroPlaceholder
    : format
      ? format(value)
      : String(value)
  const maxLabelContent = format ? format(safeMax) : String(safeMax)

  useLayoutEffect(() => {
    if (maxLabelRef.current) {
      setMaxLabelWidth(maxLabelRef.current.offsetWidth)
    }
  }, [maxLabelContent, size])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => setTrackWidth(track.clientWidth)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const fillWidthPx = (trackWidth * percent) / 100
  const labelFitsInside =
    !isZero &&
    maxLabelWidth > 0 &&
    maxLabelWidth + LABEL_INNER_GAP_PX * 2 <= fillWidthPx

  const labelPosition: 'inside' | 'outside' | 'zero' = isZero
    ? 'zero'
    : labelFitsInside
      ? 'inside'
      : 'outside'

  return (
    <div
      className={cn(
        styles.container,
        styles[`size_${size}`],
        styles[colorScheme],
        className,
      )}
      style={
        {
          '--fill-percent': `${percent}%`,
          '--label-inner-gap': `${LABEL_INNER_GAP_PX}px`,
          '--label-outer-gap': `${LABEL_OUTER_GAP_PX}px`,
          '--zero-placeholder-left': `${ZERO_PLACEHOLDER_LEFT_PX}px`,
        } as CSSProperties
      }
      role="progressbar"
      aria-valuenow={clamp(value, 0, safeMax)}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuetext={
        ariaValueText ??
        (format && typeof labelContent === 'string' ? labelContent : undefined)
      }
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ??
        (!ariaLabel && caption != null ? captionId : undefined)
      }
    >
      <div ref={trackRef} className={styles.track}>
        <div className={styles.fill} aria-hidden />
        {showLabel ? (
          <>
            <span
              className={cn(styles.label, styles[`label_${labelPosition}`])}
            >
              {labelContent}
            </span>
            {/* Hidden probe to measure the widest possible label once, so the
                inside/outside switch threshold is stable across renders. */}
            <span
              ref={maxLabelRef}
              className={cn(styles.label, styles.measureProbe)}
              aria-hidden
            >
              {maxLabelContent}
            </span>
          </>
        ) : null}
      </div>
      {caption != null ? (
        <div id={captionId} className={styles.caption}>
          {caption}
        </div>
      ) : null}
    </div>
  )
}
