import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { LOCALIZED_DATE_FORMAT } from './dayjsLocales'

const date = dayjs('2026-05-12')

describe('dayjsLocales', () => {
  it('registers localizedFormat, so the token is not printed as a letter', () => {
    expect(date.format(LOCALIZED_DATE_FORMAT)).not.toBe(LOCALIZED_DATE_FORMAT)
  })

  // Every language the kit ships: an unregistered locale silently keeps the
  // previous one, so a dropped import reads as "the date is in English".
  it.each([
    ['en', '05/12/2026'],
    ['de', '12.05.2026'],
    ['es', '12/05/2026'],
    ['fr', '12/05/2026'],
    ['id', '12/05/2026'],
    ['it', '12/05/2026'],
    ['pl', '12.05.2026'],
    ['pt', '12/05/2026'],
    ['ru', '12.05.2026'],
    ['tr', '12.05.2026'],
  ])('formats the short date for %s', (locale, expected) => {
    expect(date.locale(locale).format(LOCALIZED_DATE_FORMAT)).toBe(expected)
  })
})
