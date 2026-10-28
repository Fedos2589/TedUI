'use client'

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { FocusEventHandler, useRef } from 'react'
import { RiArrowDownSLine, RiSearchLine } from '@remixicon/react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import { Input } from '../Input'

import styles from './Combobox.module.scss'
import { ComboboxList, ComboboxItem, ComboboxEmpty } from './ComboboxParts'
import {
  ClearButton,
  getEmptyContent,
  getHasValue,
  getLabel,
} from './ComboboxShared'
import type { ComboboxProps } from './Combobox.types'

type ComboboxDesktopProps<Value> = ComboboxProps<Value> & {
  setOpen: (next: boolean) => void
}

export function ComboboxDesktop<Value>({
  options,
  value,
  inputValue,
  label,
  required,
  placeholder,
  emptyValue = 'No options',
  emptyInputValue,
  size,
  colorScheme,
  error,
  errorText,
  helperText,
  disabled,
  readOnly,
  className,
  popupClassName,
  startIcon,
  inputProps,
  openOnFocus,
  hideTrigger,
  onClear,
  renderItem,
  setOpen,
  itemToStringLabel,
  getItemKey,
  trigger,
  searchPlaceholder,
  anchor,
}: ComboboxDesktopProps<Value>) {
  const { t } = useTranslation('ui-kit')
  const controlWrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const getPopupAnchor = () => {
    // Base UI's positioner wants an element, so a passed ref is unwrapped here
    // rather than forwarded. `'current' in` keeps it off the `Element` global
    // (SSR) and narrows the union for TS.
    if (anchor) {
      return 'current' in anchor ? anchor.current : anchor
    }

    return trigger ? triggerRef.current : controlWrapperRef.current
  }

  const hasValue = getHasValue(inputValue, value, itemToStringLabel)
  const showClear = !disabled && !!onClear && hasValue
  const chevronTrigger = hideTrigger ? undefined : (
    <BaseCombobox.Trigger
      className={styles.endIconButton}
      aria-label={t('common.action.show_options')}
    >
      <RiArrowDownSLine size={16} aria-hidden />
    </BaseCombobox.Trigger>
  )
  const endIcon = showClear ? (
    <ClearButton onClear={onClear!} />
  ) : (
    chevronTrigger
  )

  // Compose rather than override: a bare `onFocus={...}` after the spread drops
  // whatever the caller passed in `inputProps` (and passing `undefined` drops it
  // too), so a consumer's focus handler would silently stop firing.
  const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    inputProps?.onFocus?.(event)

    if (openOnFocus && !disabled && !readOnly && options.length > 0) {
      setOpen(true)
    }
  }

  return (
    <>
      {trigger ? (
        <BaseCombobox.Trigger
          ref={triggerRef}
          disabled={disabled}
          render={trigger}
        />
      ) : (
        <Input
          {...inputProps}
          onFocus={handleFocus}
          className={className}
          controlWrapperRef={controlWrapperRef}
          label={label}
          required={required}
          error={error}
          errorText={errorText}
          helperText={helperText}
          size={size}
          colorScheme={colorScheme}
          startIcon={startIcon}
          endIcon={endIcon}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
        >
          {(p) => <BaseCombobox.Input {...p} />}
        </Input>
      )}
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner
          className={styles.positioner}
          side="bottom"
          // The trigger is a small button inside a wider control, so the popup
          // lines up with its left edge instead of centring on it. Same for a
          // widened popup (popupClassName), which centred would overflow a
          // half-width field — otherwise centre on the anchor (base-ui default).
          align={trigger || popupClassName ? 'start' : 'center'}
          sideOffset={8}
          positionMethod="fixed"
          anchor={getPopupAnchor}
        >
          <BaseCombobox.Popup
            className={cn(
              styles.popup,
              trigger && styles.popupWithTrigger,
              popupClassName,
            )}
          >
            {/* With a custom trigger there is no outer input to type into, so
                the popup carries the search field — the desktop twin of what
                the mobile modal already does. */}
            {trigger && (
              <div className={styles.popupSearch}>
                <Input
                  size="small"
                  colorScheme="grey"
                  startIcon={<RiSearchLine size={16} aria-hidden />}
                  placeholder={searchPlaceholder}
                >
                  {(p) => (
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- search field of a popup the user just opened
                    <BaseCombobox.Input {...p} autoFocus />
                  )}
                </Input>
              </div>
            )}
            <ComboboxList>
              {(option: Value, index: number) => (
                <ComboboxItem
                  key={getItemKey ? getItemKey(option) : index}
                  value={option}
                >
                  {renderItem
                    ? renderItem(option)
                    : getLabel(option, itemToStringLabel)}
                </ComboboxItem>
              )}
            </ComboboxList>
            <ComboboxEmpty>
              {getEmptyContent(inputValue, emptyValue, emptyInputValue)}
            </ComboboxEmpty>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </>
  )
}
