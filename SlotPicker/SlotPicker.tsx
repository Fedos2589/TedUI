'use client'

import cn from 'classnames'
import { Typography } from '../Typography'
import { moveWithArrows, tabStopId } from './radioNavigation'
import styles from './SlotPicker.module.scss'

export interface SlotPickerDay {
  id: string
  weekday: string
  number: string
  today?: boolean
  // Dimmed, still selectable: the list below then shows `emptyText`
  empty?: boolean
}

export interface SlotPickerSlot {
  id: string
  label: string
  hint?: string
  disabled?: boolean
}

export interface SlotPickerProps {
  days: SlotPickerDay[]
  day: string
  onDayChange: (id: string) => void
  slots: SlotPickerSlot[]
  value: string | null
  onChange: (id: string) => void
  emptyText: string
  daysLabel: string
  slotsLabel: string
  className?: string
}

export const SlotPicker = ({
  days,
  day,
  onDayChange,
  slots,
  value,
  onChange,
  emptyText,
  daysLabel,
  slotsLabel,
  className,
}: SlotPickerProps) => {
  const dayStop = tabStopId(days, day)
  const slotStop = tabStopId(slots, value)

  return (
    <div className={cn(styles.root, className)}>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus lives on the radios inside; the group only catches their bubbling keys */}
      <div
        role="radiogroup"
        aria-label={daysLabel}
        className={styles.days}
        onKeyDown={moveWithArrows}
      >
        {days.map((d) => (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={d.id === day}
            tabIndex={d.id === dayStop ? 0 : -1}
            data-selected={d.id === day ? '' : undefined}
            data-empty={d.empty ? '' : undefined}
            data-today={d.today ? '' : undefined}
            className={styles.day}
            onClick={() => onDayChange(d.id)}
          >
            <Typography variant="t6" component="span" className={styles.text}>
              {d.weekday}
            </Typography>
            <Typography variant="bh5" component="span" className={styles.text}>
              {d.number}
            </Typography>
          </button>
        ))}
      </div>
      {slots.length === 0 ? (
        <Typography
          variant="t4"
          color="grey-500"
          component="p"
          className={styles.empty}
        >
          {emptyText}
        </Typography>
      ) : (
        // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- same as the days group
        <div
          role="radiogroup"
          aria-label={slotsLabel}
          className={styles.slots}
          onKeyDown={moveWithArrows}
        >
          {slots.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={s.id === value}
              disabled={s.disabled}
              tabIndex={s.id === slotStop ? 0 : -1}
              data-selected={s.id === value ? '' : undefined}
              className={styles.slot}
              onClick={() => onChange(s.id)}
            >
              <Typography
                variant="bh5"
                component="span"
                className={styles.text}
              >
                {s.label}
              </Typography>
              {s.hint && (
                <Typography
                  variant="t6"
                  component="span"
                  className={cn(styles.text, styles.hint)}
                >
                  {s.hint}
                </Typography>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
