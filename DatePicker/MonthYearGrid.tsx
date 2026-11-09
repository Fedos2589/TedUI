import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { RiCheckLine } from '@remixicon/react'
import styles from './MonthYearGrid.module.scss'

export interface GridOption {
  value: number
  label: string
  disabled: boolean
  selected: boolean
}

export interface MonthYearGridProps {
  options: GridOption[]
  onSelect: (value: number) => void
  /** `list` is the desktop dropdown; `grid` is the three-column mobile step. */
  layout: 'grid' | 'list'
  'aria-label': string
  className?: string
}

const GRID_COLUMNS = 3

export const MonthYearGrid = ({
  options,
  onSelect,
  layout,
  'aria-label': ariaLabel,
  className,
}: MonthYearGridProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const [activeValue, setActiveValue] = useState<number | null>(null)

  // The list is one tab stop, and this is the option carrying it: wherever the
  // arrows last landed, falling back to the current value.
  const active =
    options.find(
      (option) => option.value === activeValue && !option.disabled,
    ) ??
    options.find((option) => option.selected && !option.disabled) ??
    options.find((option) => !option.disabled)

  const optionAt = (value: number) =>
    listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${value}"]`)

  // On open the current value takes focus, so the arrows start from it — and a
  // century of years opens on that year rather than on whatever sorts first.
  useEffect(() => {
    const list = listRef.current
    const option = active && optionAt(active.value)
    if (!list || !option) return

    option.focus({ preventScroll: true })
    if (list.clientHeight) {
      list.scrollTop =
        option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2
    }
    // On open only: the arrows take over from here, and re-running would yank
    // focus back out of wherever they moved it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** How far one arrow press moves through `options`, in list order. */
  const stepFor = (key: string) => {
    const columns = layout === 'grid' ? GRID_COLUMNS : 1

    if (key === 'ArrowUp') return -columns
    if (key === 'ArrowDown') return columns
    // A single column has no sideways — the row and the option are the same.
    if (layout === 'grid' && key === 'ArrowLeft') return -1
    if (layout === 'grid' && key === 'ArrowRight') return 1

    return 0
  }

  const moveTo = (index: number) => {
    const option = options[index]
    if (!option) return

    setActiveValue(option.value)

    const element = optionAt(option.value)
    element?.focus()
    element?.scrollIntoView({ block: 'nearest' })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const from = options.findIndex((option) => option.value === active?.value)
    if (from === -1) return

    const isEdge = event.key === 'Home' || event.key === 'End'
    const step = stepFor(event.key)
    if (!step && !isEdge) return

    event.preventDefault()

    if (isEdge) {
      const order = event.key === 'Home' ? options : [...options].reverse()
      const target = order.find((option) => !option.disabled)
      if (target) moveTo(options.indexOf(target))
      return
    }

    // Stepping over a disabled option keeps the same stride, so a column in the
    // grid stays a column even when part of the row above it is out of range.
    for (let i = from + step; i >= 0 && i < options.length; i += step) {
      if (!options[i].disabled) {
        moveTo(i)
        return
      }
    }
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      className={cn(styles.root, styles[layout], className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="option"
          data-value={option.value}
          tabIndex={option.value === active?.value ? 0 : -1}
          aria-selected={option.selected}
          disabled={option.disabled}
          className={cn(styles.option, { [styles.selected]: option.selected })}
          onClick={() => onSelect(option.value)}
          onKeyDown={handleKeyDown}
        >
          {option.label}
          {layout === 'list' && option.selected && (
            <RiCheckLine size={16} className={styles.check} />
          )}
        </button>
      ))}
    </div>
  )
}
