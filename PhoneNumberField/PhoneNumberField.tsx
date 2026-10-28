'use client'

import { ReactNode, useMemo, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import type { Country } from 'react-phone-number-input'
import { Button } from '../Button'
import { Combobox } from '../Combobox/Combobox'
import { Input } from '../Input'
import { Typography } from '../Typography'
import {
  CountryOption,
  formatInternationalInput,
  formatNationalNumber,
  getCountryOptions,
  matchesCountryQuery,
  parseInternationalInput,
  toFlagEmoji,
} from './countries'
import styles from './PhoneNumberField.module.scss'

export interface PhoneNumberFieldProps {
  country: Country
  nationalNumber: string
  onCountryChange: (country: Country) => void
  onNationalNumberChange: (nationalNumber: string) => void
  /** Overrides the list built from the current locale — mainly for stories. */
  countries?: CountryOption[]
  label?: ReactNode
  error?: boolean
  errorText?: ReactNode
  disabled?: boolean
  autoFocus?: boolean
  required?: boolean
  id?: string
  name?: string
  className?: string
}

export const PhoneNumberField = ({
  country,
  nationalNumber,
  onCountryChange,
  onNationalNumberChange,
  countries,
  label,
  error,
  errorText,
  disabled,
  autoFocus,
  required,
  id,
  name,
  className,
}: PhoneNumberFieldProps) => {
  const { t, i18n } = useTranslation('ui-kit')
  const fieldRef = useRef<HTMLDivElement>(null)

  const localeOptions = useMemo(
    () => getCountryOptions(i18n.language),
    [i18n.language],
  )
  const options = countries ?? localeOptions
  const selectedOption = options.find((option) => option.code === country)

  // The grouping is per-country, so switching the country regroups what is
  // already typed instead of waiting for the next keystroke.
  const changeCountry = (nextCountry: Country) => {
    onCountryChange(nextCountry)
    onNationalNumberChange(formatNationalNumber(nextCountry, nationalNumber))
  }

  const changeNationalNumber = (value: string) => {
    const international = parseInternationalInput(value)

    if (international) {
      onCountryChange(international.country)
      onNationalNumberChange(international.nationalNumber)
      return
    }

    // An international value whose code isn't resolvable yet stays verbatim, so
    // the code can be typed digit by digit.
    onNationalNumberChange(
      value.trimStart().startsWith('+')
        ? formatInternationalInput(value)
        : formatNationalNumber(country, value),
    )
  }

  const countryTrigger = (
    <Button
      size="small"
      variant="ghost"
      colorScheme="grey"
      disabled={disabled}
      className={styles.countryTrigger}
      aria-label={`${t('common.title.select_country')}: ${selectedOption?.name ?? country}`}
    >
      <span className={styles.flag}>{toFlagEmoji(country)}</span>
      <Typography variant="t2">+{selectedOption?.callingCode}</Typography>
    </Button>
  )

  return (
    <Input
      fullWidth
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      id={id}
      name={name}
      required={required}
      size="big"
      colorScheme="grey"
      className={cn(styles.field, className)}
      label={label}
      aria-label={label ? undefined : t('common.title.phone_number')}
      // eslint-disable-next-line jsx-a11y/no-autofocus -- opt-in prop, off by default
      autoFocus={autoFocus}
      disabled={disabled}
      error={error}
      errorText={errorText}
      controlWrapperRef={fieldRef}
      value={nationalNumber}
      onChange={(e) => changeNationalNumber(e.target.value)}
      startIcon={
        <Combobox<CountryOption>
          trigger={countryTrigger}
          anchor={fieldRef}
          options={options}
          value={selectedOption ?? null}
          onValueChange={(option) => option && changeCountry(option.code)}
          itemToStringLabel={(option) => option.name}
          isItemEqualToValue={(a, b) => a.code === b.code}
          filter={(option, query) => matchesCountryQuery(option, query)}
          getItemKey={(option) => option.code}
          mobileLabel={t('common.title.select_country')}
          disabled={disabled}
          renderItem={(option) => (
            <span className={styles.option}>
              <span className={styles.flag} aria-hidden="true">
                {toFlagEmoji(option.code)}
              </span>
              <span className={styles.optionName}>{option.name}</span>
              <Typography variant="t3" color="greyscale.400">
                +{option.callingCode}
              </Typography>
            </span>
          )}
        />
      }
    />
  )
}
