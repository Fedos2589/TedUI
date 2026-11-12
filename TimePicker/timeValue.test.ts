import { describe, expect, it } from 'vitest'

import { minutesToTime, timeToMinutes } from './timeValue'

describe('minutesToTime', () => {
  it('formats minutes after midnight as HH:mm', () => {
    expect(minutesToTime(0)).toBe('00:00')
    expect(minutesToTime(540)).toBe('09:00')
    expect(minutesToTime(1439)).toBe('23:59')
  })

  it('gives an empty field for no value or an out-of-range one', () => {
    expect(minutesToTime(null)).toBe('')
    expect(minutesToTime(-1)).toBe('')
    expect(minutesToTime(1440)).toBe('')
    expect(minutesToTime(10.5)).toBe('')
  })
})

describe('timeToMinutes', () => {
  it('parses HH:mm', () => {
    expect(timeToMinutes('00:00')).toBe(0)
    expect(timeToMinutes('09:00')).toBe(540)
    expect(timeToMinutes('23:59')).toBe(1439)
  })

  it('accepts the seconds some browsers append', () => {
    expect(timeToMinutes('09:30:00')).toBe(570)
  })

  it('gives null for empty or malformed or out-of-range input', () => {
    expect(timeToMinutes('')).toBeNull()
    expect(timeToMinutes('abc')).toBeNull()
    expect(timeToMinutes('24:00')).toBeNull()
    expect(timeToMinutes('12:60')).toBeNull()
  })
})
