'use client'

import { useEffect, useState } from 'react'
import cn from 'classnames'

import styles from './LiveRegion.module.scss'

export type LiveRegionPoliteness = 'polite' | 'assertive'

export interface LiveRegionProps {
  /** Text to announce. Falsy clears the region without announcing anything. */
  message?: string
  /** `assertive` interrupts whatever the screen reader is saying — use for errors. */
  politeness?: LiveRegionPoliteness
  /**
   * Re-announce the current text when this value changes. A second failed submit
   * produces the same message, and an unchanged live region stays silent.
   */
  nonce?: number | string
  className?: string
}

// A live region only fires on a text *change*, so setting the same string twice
// announces once. Clearing and re-setting after a beat is what makes a repeat
// audible. Under ~50ms some screen readers coalesce the two updates and drop the
// announcement entirely.
const REANNOUNCE_DELAY_MS = 120

/**
 * Visually hidden region that reads `message` out to a screen reader.
 *
 * Always rendered, even when empty: a region added to the DOM together with its
 * text is not announced — the assistive tech has to be watching the node before
 * the text lands.
 */
export const LiveRegion = ({
  message,
  politeness = 'assertive',
  nonce,
  className,
}: LiveRegionProps) => {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    if (!message) {
      setAnnounced('')
      return
    }

    setAnnounced('')
    const timer = setTimeout(() => setAnnounced(message), REANNOUNCE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [message, nonce])

  return (
    <span
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic="true"
      className={cn(styles.root, className)}
    >
      {announced}
    </span>
  )
}
