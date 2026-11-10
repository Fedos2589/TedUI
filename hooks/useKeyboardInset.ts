import { useSyncExternalStore } from 'react'

// How many px at the bottom of the layout viewport the on-screen keyboard
// covers. iOS Safari (and Chrome without `interactive-widget=resizes-content`)
// lays the keyboard over the page: `innerHeight` stays, only the visual
// viewport shrinks, so anything pinned to `bottom: 0` ends up under the keys.
// A pinch zoom shrinks the visual viewport too, but is not a keyboard: 0 then.
const getInset = () => {
  const viewport = window.visualViewport
  if (!viewport || viewport.scale > 1.01) return 0
  return Math.max(
    0,
    Math.round(window.innerHeight - viewport.height - viewport.offsetTop),
  )
}

const noop = () => undefined

const subscribe = (onChange: () => void) => {
  const viewport = window.visualViewport
  if (!viewport) return noop
  viewport.addEventListener('resize', onChange)
  viewport.addEventListener('scroll', onChange)
  return () => {
    viewport.removeEventListener('resize', onChange)
    viewport.removeEventListener('scroll', onChange)
  }
}

// SSR and the first paint: no keyboard.
export const useKeyboardInset = () =>
  useSyncExternalStore(subscribe, getInset, () => 0)
