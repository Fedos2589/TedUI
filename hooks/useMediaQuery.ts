import { useCallback, useSyncExternalStore } from 'react'

/**
 * Canonical breakpoint values, in px — synced with `UI-KIT/styles/_breakpoints.scss`
 * (and, until it goes away, the MUI theme's `breakpoints.values`).
 */
export const BREAKPOINTS = {
  sm: 600,
  md: 768, // primary mobile <-> desktop threshold
  lg: 1280,
} as const

export const minWidth = (bp: keyof typeof BREAKPOINTS) =>
  `(min-width: ${BREAKPOINTS[bp]}px)`

// One MediaQueryList per query, created lazily on the client so this module
// stays SSR-safe (no `window` at import time) and repeated renders don't
// allocate a fresh MediaQueryList on every snapshot read.
const mqlCache = new Map<string, MediaQueryList>()

const getMql = (query: string) => {
  let mql = mqlCache.get(query)
  if (!mql) {
    mql = window.matchMedia(query)
    mqlCache.set(query, mql)
  }
  return mql
}

/**
 * Replaces MUI's `useMediaQuery`. Server / first paint reports `false` — the
 * same default MUI used — then `useSyncExternalStore` reconciles to the real
 * match during hydration.
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = getMql(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => getMql(query).matches,
    () => false,
  )
}
