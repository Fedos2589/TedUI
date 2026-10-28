import { AsYouType, formatIncompletePhoneNumber } from 'libphonenumber-js/min'
import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  type Country,
} from 'react-phone-number-input'

export interface CountryOption {
  code: Country
  callingCode: string
  name: string
}

export const DEFAULT_COUNTRY: Country = 'US'

/**
 * Country to preselect for a locale: the region when the tag carries one
 * (`en-GB` -> GB), otherwise the language's most likely region from the ICU
 * likely-subtags data (`tr` -> TR, `pt` -> BR, `en` -> US). Falls back to
 * `DEFAULT_COUNTRY` for a locale the platform or the phone metadata don't know.
 */
export const getDefaultCountry = (locale: string): Country => {
  try {
    const region = new Intl.Locale(locale).maximize().region

    if (region && isSupportedCountry(region)) {
      return region as Country
    }
  } catch {
    return DEFAULT_COUNTRY
  }

  return DEFAULT_COUNTRY
}

export const getCountryOptions = (locale: string): CountryOption[] => {
  const regionNames = new Intl.DisplayNames([locale], { type: 'region' })

  return getCountries()
    .map((code) => ({
      code,
      callingCode: getCountryCallingCode(code),
      name: regionNames.of(code) || code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale))
}

// Diacritics are folded on both sides so "turk" finds "Türkiye" and "aland"
// finds "Åland Islands" — nobody types the accents when searching a country.
const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export const matchesCountryQuery = (option: CountryOption, query: string) => {
  const normalizedQuery = fold(query.trim())

  if (!normalizedQuery) {
    return true
  }

  return (
    fold(option.name).includes(normalizedQuery) ||
    `+${option.callingCode}`.includes(normalizedQuery) ||
    option.code.toLowerCase() === normalizedQuery
  )
}

/**
 * Regional-indicator pair for an ISO country code ('DE' -> 🇩🇪). Rendered by the
 * platform emoji font, so no image request and no dependency — on Windows,
 * which ships no flag glyphs, it degrades to the two letters.
 */
export const toFlagEmoji = (code: string) =>
  code
    .toUpperCase()
    .replace(/[A-Z]/g, (letter) =>
      String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65),
    )

const isInternational = (value: string) => value.trimStart().startsWith('+')

interface InternationalInput {
  country: Country
  nationalNumber: string
}

/**
 * Country and national part of a number typed or pasted in international form
 * (`+44 20 7183 8750` -> GB + `20 7183 8750`), so the picker follows the pasted
 * code instead of prefixing the current one. `null` while the value is not
 * international or the code is not resolvable yet (`+4`, `+999`).
 */
export const parseInternationalInput = (
  value: string,
): InternationalInput | null => {
  if (!isInternational(value)) {
    return null
  }

  const asYouType = new AsYouType()
  asYouType.input(value)

  const country = asYouType.getCountry()
  const nationalNumber = asYouType.getNumber()?.nationalNumber

  if (!country || !nationalNumber) {
    return null
  }

  return {
    country,
    nationalNumber: formatNationalNumber(country, nationalNumber),
  }
}

/** Grouping for an international value whose country isn't resolved yet. */
export const formatInternationalInput = (value: string) =>
  formatIncompletePhoneNumber(value)

export const toE164 = (country: Country, nationalNumber: string) => {
  const digits = nationalNumber.replace(/\D/g, '')

  // A value still being typed in international form (`+44 20…`) already carries
  // its own country code — prefixing the picked country's would corrupt it.
  return isInternational(nationalNumber)
    ? `+${digits}`
    : `+${getCountryCallingCode(country)}${digits}`
}

/**
 * Groups the national number the way the country's numbering plan does, as the
 * user types: `4158927004` -> `415 892 7004`, `5321234567` -> `532 123 45 67`.
 * The country code is dropped from the result because the field shows it in the
 * trigger; a number pasted with its `+code` prefix loses the duplicate.
 */
export const formatNationalNumber = (country: Country, value: string) => {
  const callingCode = getCountryCallingCode(country)
  const digits = value.replace(/\D/g, '')
  const nationalDigits =
    value.trimStart().startsWith('+') && digits.startsWith(callingCode)
      ? digits.slice(callingCode.length)
      : digits

  if (!nationalDigits) {
    return ''
  }

  const formatted = formatIncompletePhoneNumber(
    `+${callingCode}${nationalDigits}`,
  )

  return formatted.slice(`+${callingCode}`.length).trimStart()
}
