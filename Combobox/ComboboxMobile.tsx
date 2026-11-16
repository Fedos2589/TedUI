'use client'

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { RiArrowDownSLine, RiSearchLine } from '@remixicon/react'
import cn from 'classnames'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Modal } from '../Modal'
import { Input } from '../Input'

import styles from './Combobox.module.scss'
import { ComboboxEmpty } from './ComboboxParts'
import {
  ClearButton,
  getEmptyContent,
  getHasValue,
  getLabel,
} from './ComboboxShared'
import type { ComboboxProps } from './Combobox.types'

const OPEN_KEYS = ['Enter', ' ', 'ArrowDown']

type ComboboxMobileProps<Value> = ComboboxProps<Value> & {
  open: boolean
  setOpen: (next: boolean) => void
}

export function ComboboxMobile<Value>({
  value,
  inputValue,
  onInputValueChange,
  label,
  required,
  placeholder,
  emptyValue,
  emptyInputValue,
  size,
  colorScheme,
  error,
  errorText,
  helperText,
  disabled,
  readOnly,
  onClear,
  className,
  renderItem,
  startIcon,
  itemToStringLabel,
  getItemKey,
  mobileLabel,
  searchPlaceholder,
  trigger,
  open,
  setOpen,
}: ComboboxMobileProps<Value>) {
  const { t } = useTranslation('ui-kit')
  const fieldRef = useRef<HTMLInputElement>(null)
  const title = mobileLabel ?? (typeof label === 'string' ? label : undefined)
  const displayText =
    value != null ? getLabel(value, itemToStringLabel) : (inputValue ?? '')

  const hasValue = getHasValue(inputValue, value, itemToStringLabel)
  const showClear = !disabled && !!onClear && hasValue
  const triggerEndIcon = showClear ? (
    <ClearButton onClear={onClear!} />
  ) : (
    <RiArrowDownSLine size={16} aria-hidden />
  )

  // Search × clears only the query text, never the selected value — the
  // trigger × (outside the modal) is what fully resets state via consumer's
  // `onClear`.
  const showSearchClear = (inputValue?.length ?? 0) > 0
  const searchEndIcon = showSearchClear ? (
    <ClearButton onClear={() => onInputValueChange?.('')} />
  ) : undefined

  return (
    <>
      {trigger ? (
        <BaseCombobox.Trigger disabled={disabled} render={trigger} />
      ) : (
        <Input
          className={className}
          label={label}
          required={required}
          error={error}
          errorText={errorText}
          helperText={helperText}
          size={size}
          colorScheme={colorScheme}
          startIcon={startIcon}
          endIcon={triggerEndIcon}
          disabled={disabled}
          placeholder={placeholder}
          readOnly
          ref={fieldRef}
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={open}
          onKeyDown={(event) => {
            if (disabled || !OPEN_KEYS.includes(event.key)) return
            event.preventDefault()
            setOpen(true)
          }}
          value={displayText}
          onControlWrapperClick={() => !disabled && setOpen(true)}
        />
      )}
      <Modal
        isVisible={open}
        onClose={() => {
          setOpen(false)
          fieldRef.current?.focus()
        }}
        title={title}
        aria-label={title ? undefined : t('common.action.show_options')}
      >
        <div className={styles.mobileModalContent}>
          {/* A read-only combobox is a plain select — there is nothing to type,
              so the modal shows just the list (desktop already honours this via
              the trigger's own readOnly). */}
          {!readOnly && (
            <Input
              size="small"
              colorScheme="grey"
              startIcon={<RiSearchLine size={16} aria-hidden />}
              endIcon={searchEndIcon}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            >
              {(p) => (
                // eslint-disable-next-line jsx-a11y/no-autofocus -- search field of a popup the user just opened
                <BaseCombobox.Input {...p} autoFocus />
              )}
            </Input>
          )}
          <BaseCombobox.List
            className={cn(
              styles.mobileList,
              readOnly && styles.mobileListNoSearch,
            )}
          >
            {(option: Value, index: number) => (
              <BaseCombobox.Item
                key={getItemKey ? getItemKey(option) : index}
                value={option}
                className={styles.mobileItem}
              >
                {renderItem
                  ? renderItem(option)
                  : getLabel(option, itemToStringLabel)}
              </BaseCombobox.Item>
            )}
          </BaseCombobox.List>
          <ComboboxEmpty>
            {getEmptyContent(inputValue, emptyValue, emptyInputValue)}
          </ComboboxEmpty>
        </div>
      </Modal>
    </>
  )
}
