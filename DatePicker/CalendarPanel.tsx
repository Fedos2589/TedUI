import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import { Button } from '../Button'
import { IconButton } from '../IconButton/IconButton'
import {
  buildMonthGrid,
  buildYearOptions,
  firstEnabledDate,
  isDateDisabled,
  isInsideRange,
} from './calendarModel'
import { DATE_VALUE_FORMAT, isMonthDisabled, isYearDisabled } from './dateValue'
import { DayCell } from './DayCell'
import { GridOption, MonthYearGrid } from './MonthYearGrid'
import { DatePickerView } from './DatePicker.types'
import { DateRangeSelection, isInPreviewRange } from './rangeSelection'
import styles from './CalendarPanel.module.scss'

/** The design draws every locale Monday-first, dayjs `weekStart` notwithstanding. */
const WEEK_START = 1

const MONTHS_IN_YEAR = 12

/**
 * The design labels the week with a single letter. It comes off the locale's
 * short name rather than `dd`: dayjs's minimal names are a different convention
 * per locale, and in pt they mix Brazilian ordinals (2ª–6ª) with two-letter
 * weekend names — and drop the accent on "Sá" while they are at it.
 */
const weekdayLetter = (day: Dayjs) => Array.from(day.format('ddd'))[0]

export interface CalendarPanelProps {
  view: DatePickerView
  views: DatePickerView[]
  viewMonth: Dayjs
  selection: DateRangeSelection
  min: Dayjs | null
  max: Dayjs | null
  layout: 'desktop' | 'mobile'
  onViewChange: (view: DatePickerView) => void
  onViewMonthChange: (month: Dayjs) => void
  onDayPick: (date: Dayjs) => void
  onMonthPick: (month: number) => void
  onYearPick: (year: number) => void
}

export const CalendarPanel = ({
  view,
  views,
  viewMonth,
  selection,
  min,
  max,
  layout,
  onViewChange,
  onViewMonthChange,
  onDayPick,
  onMonthPick,
  onYearPick,
}: CalendarPanelProps) => {
  const { t } = useTranslation('ui-kit')
  // Where the pointer is while a range is half-picked — the end the user has
  // not committed yet, so the days it would cover can be drawn as they move.
  const [hovered, setHovered] = useState<Dayjs | null>(null)
  // The day the arrow keys last landed on. The grid is one tab stop, so exactly
  // one cell carries `tabIndex={0}` and this is it.
  const [activeIso, setActiveIso] = useState<string | null>(null)
  // Set when a key press moves the active day: focus has to follow it, but only
  // once the moved cell has rendered.
  const pendingFocus = useRef<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const today = dayjs()
  const isDesktop = layout === 'desktop'
  const hasDayView = views.includes('day')
  // With a day grid to keep on screen, the coarse steps are a dropdown over it;
  // without one they are the panel itself.
  const asDropdown = isDesktop && hasDayView
  // The month arrows are quiet chevrons in the desktop popover and filled thumb
  // targets on the sheet.
  const navArrow = isDesktop
    ? ({ size: 'medium', colorScheme: 'white' } as const)
    : ({ size: 'extraBig', colorScheme: 'grey' } as const)

  const weeks = buildMonthGrid(viewMonth, WEEK_START)
  const prevDisabled =
    !!min && viewMonth.subtract(1, 'month').endOf('month').isBefore(min, 'day')
  const nextDisabled =
    !!max && viewMonth.add(1, 'month').startOf('month').isAfter(max, 'day')

  // Where the tab stop sits when the arrows have not been used in this month:
  // the day already picked, else today, else the first day that can be picked.
  const defaultActive = () => {
    const anchor =
      [selection.from, selection.to, today].find((date) =>
        date?.isSame(viewMonth, 'month'),
      ) ?? viewMonth.startOf('month')

    return (
      firstEnabledDate(anchor, 1, min, max) ??
      firstEnabledDate(anchor, -1, min, max) ??
      anchor
    )
  }

  const stored = activeIso ? dayjs(activeIso) : null
  const activeDate = stored?.isSame(viewMonth, 'month')
    ? stored
    : defaultActive()

  // Moves the tab stop, stepping over days that cannot be picked, and turns the
  // page when the day it lands on belongs to another month.
  const moveActive = (target: Dayjs, step: 1 | -1) => {
    const next = firstEnabledDate(target, step, min, max)
    if (!next) return

    const iso = next.format(DATE_VALUE_FORMAT)
    setActiveIso(iso)
    pendingFocus.current = iso

    if (!next.isSame(viewMonth, 'month')) onViewMonthChange(next)
  }

  // Clicking or tabbing to a day makes it the one the arrows move from —
  // otherwise the next arrow press would jump back to wherever the tab stop
  // happened to be sitting.
  const handleDayFocus = (date: Dayjs) => {
    setHovered(date)
    setActiveIso(date.format(DATE_VALUE_FORMAT))
  }

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const week = weeks.find((row) =>
      row.some((day) => day.isSame(activeDate, 'day')),
    )
    const page = event.shiftKey ? 'year' : 'month'

    switch (event.key) {
      case 'ArrowLeft':
        moveActive(activeDate.subtract(1, 'day'), -1)
        break
      case 'ArrowRight':
        moveActive(activeDate.add(1, 'day'), 1)
        break
      case 'ArrowUp':
        moveActive(activeDate.subtract(1, 'week'), -1)
        break
      case 'ArrowDown':
        moveActive(activeDate.add(1, 'week'), 1)
        break
      case 'Home':
        if (week) moveActive(week[0], 1)
        break
      case 'End':
        if (week) moveActive(week[week.length - 1], -1)
        break
      case 'PageUp':
        moveActive(activeDate.subtract(1, page), -1)
        break
      case 'PageDown':
        moveActive(activeDate.add(1, page), 1)
        break
      default:
        // Enter, Space and Tab are the button's and the browser's to handle.
        return
    }

    event.preventDefault()
  }

  useEffect(() => {
    const iso = pendingFocus.current
    if (!iso) return

    pendingFocus.current = null
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)
      ?.focus()
  })

  const monthOptions: GridOption[] = Array.from(
    { length: MONTHS_IN_YEAR },
    (_, month) => ({
      value: month,
      label: viewMonth.month(month).format(asDropdown ? 'MMMM' : 'MMM'),
      disabled: isMonthDisabled(viewMonth.year(), month, min, max),
      selected: viewMonth.month() === month,
    }),
  )

  const yearOptions: GridOption[] = buildYearOptions(min, max, viewMonth).map(
    (year) => ({
      value: year,
      label: String(year),
      disabled: isYearDisabled(year, min, max),
      selected: viewMonth.year() === year,
    }),
  )

  const renderOptions = (step: 'month' | 'year') => (
    <MonthYearGrid
      options={step === 'month' ? monthOptions : yearOptions}
      onSelect={step === 'month' ? onMonthPick : onYearPick}
      layout={asDropdown ? 'list' : 'grid'}
      aria-label={t(
        step === 'month'
          ? 'common.datePicker.selectMonth'
          : 'common.datePicker.selectYear',
      )}
      className={cn({ [styles.dropdown]: asDropdown })}
    />
  )

  if (view !== 'day' && !asDropdown) {
    return (
      <div className={styles.root}>
        {/* The year the months belong to doubles as the way back to it. */}
        {view === 'month' && views.includes('year') && (
          <Button
            size="small"
            variant="ghost"
            colorScheme="black"
            className={styles.stepBack}
            onClick={() => onViewChange('year')}
          >
            {viewMonth.format('YYYY')}
          </Button>
        )}
        {renderOptions(view)}
      </div>
    )
  }

  return (
    <div className={styles.root} onMouseLeave={() => setHovered(null)}>
      <div className={styles.nav}>
        {isDesktop ? (
          <div className={styles.navLabel}>
            <span className={styles.navPartWrap}>
              <Button
                size="small"
                variant="ghost"
                colorScheme="black"
                className={cn(styles.navPart, {
                  [styles.navPartActive]: view === 'month',
                })}
                onClick={() => onViewChange(view === 'month' ? 'day' : 'month')}
              >
                {viewMonth.format('MMMM')}
              </Button>
              {view === 'month' && renderOptions('month')}
            </span>
            <span className={styles.navPartWrap}>
              <Button
                size="small"
                variant="ghost"
                colorScheme="black"
                className={cn(styles.navPart, {
                  [styles.navPartActive]: view === 'year',
                })}
                onClick={() => onViewChange(view === 'year' ? 'day' : 'year')}
              >
                {viewMonth.format('YYYY')}
              </Button>
              {view === 'year' && renderOptions('year')}
            </span>
          </div>
        ) : (
          <Button
            size="medium"
            variant="solid"
            colorScheme="grey"
            className={styles.navTrigger}
            onClick={() => onViewChange('year')}
          >
            {viewMonth.format('MMMM YYYY')}
            <RiArrowDownSLine size={20} />
          </Button>
        )}

        <div className={styles.navArrows}>
          <IconButton
            {...navArrow}
            aria-label={t('common.datePicker.prevMonth')}
            disabled={prevDisabled}
            onClick={() => onViewMonthChange(viewMonth.subtract(1, 'month'))}
          >
            <RiArrowLeftSLine size={20} />
          </IconButton>
          <IconButton
            {...navArrow}
            aria-label={t('common.datePicker.nextMonth')}
            disabled={nextDisabled}
            onClick={() => onViewMonthChange(viewMonth.add(1, 'month'))}
          >
            <RiArrowRightSLine size={20} />
          </IconButton>
        </div>
      </div>

      <div className={styles.weekdays} aria-hidden>
        {weeks[0].map((day) => (
          <span key={day.format('YYYY-MM-DD')}>{weekdayLetter(day)}</span>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={viewMonth.format('MMMM YYYY')}
        className={styles.weeks}
      >
        {weeks.map((week) => (
          <div
            role="row"
            key={week[0].format('YYYY-MM-DD')}
            className={styles.week}
          >
            {week.map((day) => (
              <DayCell
                key={day.format('YYYY-MM-DD')}
                date={day}
                isOutsideMonth={!day.isSame(viewMonth, 'month')}
                isSelected={
                  !!selection.from?.isSame(day, 'day') ||
                  !!selection.to?.isSame(day, 'day')
                }
                isInRange={
                  isInsideRange(day, selection.from, selection.to) ||
                  isInPreviewRange(day, selection, hovered)
                }
                isToday={day.isSame(today, 'day')}
                disabled={isDateDisabled(day, min, max)}
                isActive={day.isSame(activeDate, 'day')}
                onSelect={onDayPick}
                onHover={setHovered}
                onFocus={handleDayFocus}
                onKeyDown={handleDayKeyDown}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
