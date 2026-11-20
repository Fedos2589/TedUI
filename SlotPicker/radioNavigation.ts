import type { KeyboardEvent } from 'react'

const KEY_STEP: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
}

// Radio semantics by hand: arrows move focus and select, Home/End jump, Tab leaves the group
export const moveWithArrows = (event: KeyboardEvent<HTMLElement>) => {
  const radios = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]:not(:disabled)',
    ),
  )
  const current = radios.indexOf(event.target as HTMLButtonElement)
  if (current === -1) return
  let next: number
  if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = radios.length - 1
  else if (event.key in KEY_STEP)
    next = (current + KEY_STEP[event.key] + radios.length) % radios.length
  else return
  event.preventDefault()
  radios[next].focus()
  radios[next].click()
}

// The checked option is the one Tab lands on; with nothing checked, the first enabled one
export const tabStopId = (
  items: { id: string; disabled?: boolean }[],
  checked: string | null,
) =>
  items.some((i) => i.id === checked && !i.disabled)
    ? checked
    : items.find((i) => !i.disabled)?.id
