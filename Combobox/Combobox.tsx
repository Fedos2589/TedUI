'use client'

import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useBreakpoints from '../hooks/useBreakpoints'
import { ComboboxDesktop } from './ComboboxDesktop'
import { ComboboxMobile } from './ComboboxMobile'
import type { ComboboxProps } from './Combobox.types'

export function Combobox<Value = string>(props: ComboboxProps<Value>) {
  const { t } = useTranslation('ui-kit')
  const { isMobile: viewportIsMobile } = useBreakpoints()
  const isMobile = props.forceMobile ?? viewportIsMobile
  const [open, setOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  // The mobile modal has always been controlled; `openOnFocus` needs control on
  // desktop too. Everyone else stays uncontrolled, so their behaviour is
  // untouched by this prop existing.
  const isOpenControlled = isMobile || !!props.openOnFocus

  // A suggestions-style combobox has nothing to say when the list is empty, so
  // don't open an empty popup — base-ui would render the "no options" message
  // over the field. Selects that do want that message stay uncontrolled and are
  // unaffected. The mobile modal keeps opening: its search field is the way in.
  const resolvedOpen =
    isMobile || props.trigger ? open : open && props.options.length > 0

  const wrappedOnClear = props.onClear
    ? () => {
        setResetKey((k) => k + 1)
        props.onClear!()
      }
    : undefined

  const childProps: ComboboxProps<Value> = {
    ...props,
    onClear: wrappedOnClear,
    emptyInputValue:
      props.emptyInputValue ?? t('common.text.startTypingToSeeSuggestions'),
    searchPlaceholder:
      props.searchPlaceholder ?? String(t('common.placeholder.search')),
  }

  return (
    <BaseCombobox.Root<Value>
      key={resetKey}
      items={props.options}
      value={props.value}
      inputValue={props.inputValue}
      onValueChange={props.onValueChange}
      onInputValueChange={props.onInputValueChange}
      itemToStringLabel={props.itemToStringLabel}
      isItemEqualToValue={props.isItemEqualToValue}
      filter={props.filter}
      disabled={props.disabled}
      open={isOpenControlled ? resolvedOpen : undefined}
      onOpenChange={isOpenControlled ? setOpen : undefined}
    >
      {isMobile ? (
        <ComboboxMobile {...childProps} open={open} setOpen={setOpen} />
      ) : (
        <ComboboxDesktop {...childProps} setOpen={setOpen} />
      )}
    </BaseCombobox.Root>
  )
}
