'use client'

import classNames from 'classnames'
import {
  useId,
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { minutesToTime } from '../TimePicker/timeValue'
import { layoutItems, minuteAt } from './layout'
import styles from './ScheduleGrid.module.scss'

export type ScheduleGridItemColorScheme = 'blue' | 'green' | 'grey' | 'red'

export interface ScheduleGridItem {
  id: string
  startMinute: number
  endMinute: number
  children: ReactNode
  colorScheme?: ScheduleGridItemColorScheme
}

export interface ScheduleGridColumn {
  id: string
  label: ReactNode
  items: ScheduleGridItem[]
}

export interface ScheduleGridProps extends Omit<
  ComponentProps<'div'>,
  'children' | 'onClick'
> {
  columns: ScheduleGridColumn[]
  /** Minutes from midnight: the grid shows [startMinute, endMinute). */
  startMinute: number
  endMinute: number
  /** Clicks on empty space snap down to this many minutes. */
  stepMinutes?: number
  onItemClick?: (columnId: string, itemId: string) => void
  onEmptyClick?: (columnId: string, minute: number) => void
  'aria-label': string
}

const schemeStyles: Record<ScheduleGridItemColorScheme, string> = {
  blue: styles.schemeBlue,
  green: styles.schemeGreen,
  grey: styles.schemeGrey,
  red: styles.schemeRed,
}

// 24:00 is how an item that ends at midnight reads; minutesToTime only knows 00:00–23:59.
const clock = (minute: number) =>
  minute === 24 * 60 ? '24:00' : minutesToTime(minute)

const hoursIn = (startMinute: number, endMinute: number) => {
  const hours: number[] = []
  for (let h = Math.ceil(startMinute / 60); h * 60 < endMinute; h++) {
    hours.push(h * 60)
  }
  return hours
}

export const ScheduleGrid = ({
  columns,
  startMinute,
  endMinute,
  stepMinutes = 15,
  onItemClick,
  onEmptyClick,
  className,
  'aria-label': ariaLabel,
  ...rest
}: ScheduleGridProps) => {
  const id = useId()
  // An empty or inverted range (a day off) still gets one hour of grid instead of NaN.
  const range = {
    startMinute,
    endMinute: Math.max(endMinute, startMinute + 60),
  }
  const length = range.endMinute - range.startMinute
  const hours = hoursIn(startMinute, range.endMinute)
  const percent = (minute: number) =>
    `${((minute - startMinute) / length) * 100}%`

  const handleEmptyClick = (
    columnId: string,
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction =
      rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0
    onEmptyClick?.(columnId, minuteAt(fraction, range, stepMinutes))
  }

  return (
    <div
      {...rest}
      role="group"
      aria-label={ariaLabel}
      className={classNames(styles.root, className)}
    >
      <div
        className={styles.inner}
        style={{ '--schedule-grid-hours': length / 60 } as CSSProperties}
      >
        <div className={styles.gutter} aria-hidden>
          <div className={styles.header} />
          <div className={styles.body}>
            {hours.map((minute) => (
              <span
                key={minute}
                className={styles.hourLabel}
                style={{ top: percent(minute) }}
              >
                {clock(minute)}
              </span>
            ))}
          </div>
        </div>
        {columns.map((column, index) => (
          <div
            key={column.id}
            role="group"
            aria-labelledby={`${id}-col-${index}`}
            className={styles.column}
          >
            <div id={`${id}-col-${index}`} className={styles.header}>
              {column.label}
            </div>
            {/* A mouse-only shortcut: the consumer offers a keyboard route to the same action. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- see above */}
            <div
              className={classNames(
                styles.body,
                onEmptyClick && styles.clickable,
              )}
              onClick={onEmptyClick && ((e) => handleEmptyClick(column.id, e))}
            >
              {hours.map((minute) => (
                <span
                  key={minute}
                  aria-hidden
                  className={styles.hourLine}
                  style={{ top: percent(minute) }}
                />
              ))}
              <ul className={styles.items}>
                {layoutItems(column.items, range).map((placed) => {
                  const { item } = placed
                  const itemClassName = classNames(
                    styles.item,
                    schemeStyles[item.colorScheme ?? 'blue'],
                  )
                  const style = {
                    top: `${placed.top * 100}%`,
                    height: `${placed.height * 100}%`,
                    left: `${(placed.lane / placed.lanes) * 100}%`,
                    width: `${100 / placed.lanes}%`,
                  }
                  const content = (
                    <>
                      <span className={styles.srOnly}>
                        {clock(item.startMinute)}–{clock(item.endMinute)}{' '}
                      </span>
                      {item.children}
                    </>
                  )
                  return (
                    <li key={item.id} className={styles.slot} style={style}>
                      {onItemClick ? (
                        <button
                          type="button"
                          className={classNames(
                            itemClassName,
                            styles.itemButton,
                          )}
                          onClick={() => onItemClick(column.id, item.id)}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className={itemClassName}>{content}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
