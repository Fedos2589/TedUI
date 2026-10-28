'use client'

import { KeyboardEvent, useRef, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Input } from '../Input'
import { Modal } from '../Modal'
import { Popover } from '../Popover/Popover'
import useBreakpoints from '../hooks/useBreakpoints'
import type { ButtonProps } from '../Button'
import { clampDate } from './calendarModel'
import { CalendarPanel } from './CalendarPanel'
import { formatDateValue, parseDateValue } from './dateValue'
import { DatePickerProps, DatePickerView } from './DatePicker.types'
import { DateRangeSelection, nextRangeSelection } from './rangeSelection'
import { LOCALIZED_DATE_FORMAT } from './dayjsLocales'
import styles from './DatePicker.module.scss'

const DEFAULT_VIEWS: DatePickerView[] = ['year', 'month', 'day']

const EMPTY_SELECTION: DateRangeSelection = { from: null, to: null }

const isComplete = (selection: DateRangeSelection, isRange: boolean) =>
  isRange ? !!selection.from && !!selection.to : !!selection.from

export const DatePicker = (props: DatePickerProps) => {
  const {
    minDate,
    maxDate,
    views = DEFAULT_VIEWS,
    locale,
    disabled,
    error,
    errorText,
    placeholder,
    label,
    size,
    colorScheme,
    startIcon,
    endIcon,
    onOpen,
    className,
  } = props

  const { t, i18n } = useTranslation('ui-kit')
  const { isDesktop } = useBreakpoints()
  const anchorRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLInputElement>(null)

  const isRange = props.mode === 'range'
  const hasDayView = views.includes('day')
  const terminalView = views[views.length - 1]
  const activeLocale = locale ?? i18n.language

  // `locale()` with nothing to set is dayjs's getter and hands back the locale
  // name, so an unset `i18n.language` would turn every date into a string.
  const withLocale = (date: Dayjs) =>
    activeLocale ? date.locale(activeLocale) : date

  const min = parseDateValue(minDate)
  const max = parseDateValue(maxDate)

  const committed: DateRangeSelection = isRange
    ? {
        from: parseDateValue(props.value?.from),
        to: parseDateValue(props.value?.to),
      }
    : { from: parseDateValue(props.value), to: parseDateValue(props.value) }

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<DatePickerView>(
    hasDayView ? 'day' : views[0],
  )
  const [draft, setDraft] = useState<DateRangeSelection>(committed)
  const [viewMonth, setViewMonth] = useState<Dayjs>(() =>
    withLocale(clampDate(committed.from ?? dayjs(), min, max)),
  )

  const commit = (selection: DateRangeSelection) => {
    if (props.mode === 'range') {
      props.onChange({
        from: formatDateValue(selection.from),
        to: formatDateValue(selection.to),
      })
      return
    }

    props.onChange(formatDateValue(selection.from))
  }

  const openPicker = () => {
    if (disabled) return

    setDraft(committed)
    setView(hasDayView ? 'day' : views[0])
    setViewMonth(withLocale(clampDate(committed.from ?? dayjs(), min, max)))
    setOpen(true)
    onOpen?.()
  }

  const close = () => {
    setOpen(false)
    // The popover is anchored to a ref rather than mounted on a base-ui
    // trigger, so nothing else would put focus back on the field, and it would
    // drop to <body> as the calendar unmounts.
    triggerRef.current?.focus()
  }

  // Down is what a date field is expected to answer to, alongside the two keys
  // any button opens on.
  const OPEN_KEYS = ['Enter', ' ', 'ArrowDown']

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!OPEN_KEYS.includes(event.key)) return

    event.preventDefault()
    openPicker()
  }

  const handleDayPick = (date: Dayjs) => {
    const next = isRange
      ? nextRangeSelection(draft, date)
      : { from: date, to: date }

    setDraft(next)
    setViewMonth(withLocale(date))

    // Desktop commits as you pick — there is no Apply button in that layout.
    // A half-picked range is not a value yet, so it keeps the popover open.
    if (isDesktop && isComplete(next, isRange)) {
      commit(next)
      close()
    }
  }

  const handleYearPick = (year: number) => {
    setViewMonth(withLocale(clampDate(viewMonth.year(year), min, max)))
    setView(views.includes('month') ? 'month' : 'day')
  }

  const handleMonthPick = (month: number) => {
    const nextMonth = withLocale(clampDate(viewMonth.month(month), min, max))
    setViewMonth(nextMonth)

    if (terminalView !== 'month') {
      setView('day')
      return
    }

    const picked = clampDate(nextMonth.startOf('month'), min, max)
    const next = { from: picked, to: picked }
    setDraft(next)

    if (isDesktop) {
      commit(next)
      close()
    }
  }

  const formatTrigger = (date: Dayjs) =>
    withLocale(date).format(hasDayView ? LOCALIZED_DATE_FORMAT : 'MMMM YYYY')

  const triggerValue = () => {
    if (!committed.from) return ''
    if (!isRange) return formatTrigger(committed.from)

    return committed.to
      ? `${formatTrigger(committed.from)} – ${formatTrigger(committed.to)}`
      : formatTrigger(committed.from)
  }

  const subtitle = () => {
    if (!draft.from) return null

    // Without a day step the pick only ever means a month, so the line must not
    // name a day — the first of it — the way the trigger already avoids doing.
    if (!hasDayView) {
      const from = formatTrigger(draft.from)

      return isRange && draft.to ? `${from} – ${formatTrigger(draft.to)}` : from
    }

    if (!isRange) return withLocale(draft.from).format('dddd, D MMMM YYYY')
    if (!draft.to) return withLocale(draft.from).format('D MMMM YYYY')

    const days = draft.to.diff(draft.from, 'day') + 1
    const from = withLocale(draft.from)
    const to = withLocale(draft.to)
    const span = from.isSame(to, 'month')
      ? `${from.format('D')} – ${to.format('D MMMM YYYY')}`
      : `${from.format('D MMM')} – ${to.format('D MMM YYYY')}`

    return `${span}, ${t('common.datePicker.daysCount', { count: days })}`
  }

  const panel = (
    <CalendarPanel
      view={view}
      views={views}
      viewMonth={viewMonth}
      selection={draft}
      min={min}
      max={max}
      layout={isDesktop ? 'desktop' : 'mobile'}
      onViewChange={setView}
      onViewMonthChange={(month) => setViewMonth(withLocale(month))}
      onDayPick={handleDayPick}
      onMonthPick={handleMonthPick}
      onYearPick={handleYearPick}
    />
  )

  // Walking the steps back the way they were entered: year came from the day
  // grid, month came from the year — and neither exists when it is not a view.
  const backTarget: DatePickerView | undefined =
    view === 'month' && views.includes('year')
      ? 'year'
      : view === 'year' && hasDayView
        ? 'day'
        : undefined

  const sheetTitle = () => {
    if (view === 'year') return t('common.datePicker.selectYear')
    if (view === 'month') return t('common.datePicker.selectMonth')

    return t(
      isRange
        ? 'common.datePicker.selectDates'
        : 'common.datePicker.selectDate',
    )
  }

  const footerButtons = (): ButtonProps[] => [
    {
      children: t(isRange ? 'common.button.clear' : 'common.button.cancel'),
      size: 'large',
      colorScheme: 'lightBlue',
      fullWidth: true,
      onClick: isRange ? () => setDraft(EMPTY_SELECTION) : close,
    },
    {
      children: t('common.button.apply'),
      size: 'large',
      colorScheme: 'blue',
      fullWidth: true,
      disabled: !isComplete(draft, isRange),
      onClick: () => {
        commit(draft)
        close()
      },
    },
  ]

  return (
    <div className={className}>
      <Input
        ref={triggerRef}
        readOnly
        value={triggerValue()}
        placeholder={
          placeholder ??
          t(
            isRange
              ? 'common.datePicker.selectDates'
              : 'common.datePicker.selectDate',
          )
        }
        label={label}
        size={size}
        colorScheme={colorScheme}
        startIcon={startIcon}
        endIcon={endIcon}
        error={error}
        errorText={errorText}
        disabled={disabled}
        className={styles.trigger}
        controlWrapperRef={anchorRef}
        aria-haspopup="dialog"
        aria-expanded={open}
        onControlWrapperClick={openPicker}
        onKeyDown={handleTriggerKeyDown}
      />

      {isDesktop ? (
        <Popover
          open={open}
          onOpenChange={(next) => !next && close()}
          anchor={anchorRef}
          side="bottom"
          align="start"
          className={styles.popover}
        >
          {panel}
        </Popover>
      ) : (
        <Modal
          isVisible={open}
          title={sheetTitle()}
          subtitle={view === terminalView ? subtitle() : undefined}
          contentClassName={styles.sheetContent}
          onClose={close}
          onBack={backTarget ? () => setView(backTarget) : undefined}
          buttons={view === terminalView ? footerButtons() : undefined}
        >
          {panel}
        </Modal>
      )}
    </div>
  )
}
