'use client'

import type { ReactNode } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

import styles from './Combobox.module.scss'

export function getLabel<Value>(
  item: Value,
  itemToStringLabel?: (item: Value) => string,
) {
  return itemToStringLabel ? itemToStringLabel(item) : String(item)
}

// Before the user types, an empty list just means the search hasn't started —
// prompt them to type (emptyInputValue) instead of showing a "no results" message.
export function getEmptyContent(
  inputValue: string | undefined,
  emptyValue: ReactNode,
  emptyInputValue: ReactNode,
): ReactNode {
  return inputValue?.trim() ? emptyValue : emptyInputValue
}

// Whether the inline clear (×) button should show. A non-null `value` whose
// rendered label is empty (e.g. '' or { name: '' }) counts as no value, so the
// button stays hidden until there's real text/selection to clear.
export function getHasValue<Value>(
  inputValue?: string,
  value?: Value | null,
  itemToStringLabel?: (item: Value) => string,
) {
  const valueLabel = value != null ? getLabel(value, itemToStringLabel) : ''
  return (inputValue?.length ?? 0) > 0 || valueLabel.length > 0
}

export function ClearButton({ onClear }: { onClear: () => void }) {
  const { t } = useTranslation('ui-kit')
  return (
    <button
      type="button"
      className={styles.endIconButton}
      onClick={(e) => {
        e.stopPropagation()
        onClear()
      }}
      aria-label={t('common.action.clear')}
    >
      <RiCloseLine size={16} aria-hidden />
    </button>
  )
}
