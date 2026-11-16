// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhoneNumberField } from './PhoneNumberField'

describe('PhoneNumberField country button', () => {
  // The visible text is "+7"; a name that doesn't start with it fails WCAG
  // 2.5.3 (label in name) for voice-control users saying "click plus seven".
  it('starts its accessible name with the visible calling code', () => {
    render(
      <PhoneNumberField
        country="RU"
        nationalNumber=""
        countries={[{ code: 'RU', callingCode: '7', name: 'Russia' }]}
        onCountryChange={vi.fn()}
        onNationalNumberChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('combobox', {
        name: '+7, common.title.select_country: Russia',
      }),
    ).toBeTruthy()
  })
})
