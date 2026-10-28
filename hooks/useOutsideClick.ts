import { RefObject, useEffect } from 'react'

/**
 * Calls `onOutsideClick` when a pointer press lands outside `ref`.
 *
 * Replaces MUI's `ClickAwayListener`. Listens on `mousedown`/`touchstart`
 * rather than `click` on purpose: when a click both opens the popup and
 * enables this hook, React commits the effect while that same click is still
 * bubbling, so a `click` listener would fire immediately and close it again.
 * The press half of the opening interaction has already passed by then.
 *
 * Note the listener is on `document`, so content rendered through a portal
 * (a tooltip popup, say) counts as *outside* unless it lives inside `ref`.
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return

    const handle = (event: MouseEvent | TouchEvent) => {
      const node = ref.current
      if (!node || node.contains(event.target as Node)) return
      onOutsideClick()
    }

    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('touchstart', handle)
    }
  }, [ref, onOutsideClick, enabled])
}
