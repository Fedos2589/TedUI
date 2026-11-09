import { minWidth, useMediaQuery } from './useMediaQuery'

// Desktop threshold — `$bp-md: 768px` in UI-KIT/styles/_breakpoints.scss.
const DESKTOP_QUERY = minWidth('md')

/**
 * Server / first paint defaults to mobile (`isDesktop: false`) — matching the
 * previous MUI `useMediaQuery` SSR default — then reconciles on hydration.
 */
const useBreakpoints = () => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  return { isMobile: !isDesktop, isDesktop } as const
}

export default useBreakpoints
