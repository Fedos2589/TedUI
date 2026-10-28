import { KeyboardEvent } from 'react'
import { Dayjs } from 'dayjs'
import cn from 'classnames'
import styles from './DayCell.module.scss'

export interface DayCellProps {
  date: Dayjs
  /** Leading/trailing day borrowed from a neighbouring month. */
  isOutsideMonth: boolean
  isSelected: boolean
  isInRange: boolean
  isToday: boolean
  disabled: boolean
  /** The one cell Tab reaches; the arrow keys move it. */
  isActive: boolean
  onSelect: (date: Dayjs) => void
  /** Fires while the pointer rests on the day. */
  onHover: (date: Dayjs) => void
  /** Fires when the day takes focus, however it got there. */
  onFocus: (date: Dayjs) => void
  /** Arrow keys and the like, handled by the panel that owns the month. */
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}

export const DayCell = ({
  date,
  isOutsideMonth,
  isSelected,
  isInRange,
  isToday,
  disabled,
  isActive,
  onSelect,
  onHover,
  onFocus,
  onKeyDown,
}: DayCellProps) => (
  // The gridcell wraps the button rather than being it: a button carrying
  // role="gridcell" stops announcing itself as a button.
  <div role="gridcell" aria-selected={isSelected} className={styles.cellWrap}>
    <button
      type="button"
      // The grid is one tab stop: the panel moves focus between the cells, and
      // looks the target up by this attribute once React has rendered it.
      tabIndex={isActive ? 0 : -1}
      data-date={date.format('YYYY-MM-DD')}
      aria-current={isToday ? 'date' : undefined}
      aria-label={date.format('D MMMM YYYY')}
      disabled={disabled}
      className={cn(styles.cell, {
        [styles.outside]: isOutsideMonth,
        [styles.selected]: isSelected,
        [styles.inRange]: isInRange && !isSelected,
        [styles.today]: isToday && !isSelected,
      })}
      onClick={() => onSelect(date)}
      onKeyDown={onKeyDown}
      onMouseEnter={() => onHover(date)}
      onFocus={() => onFocus(date)}
    >
      {date.date()}
    </button>
  </div>
)
