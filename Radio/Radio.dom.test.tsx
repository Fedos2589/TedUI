// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Radio } from './Radio'
import { RadioGroup } from '../RadioGroup/RadioGroup'

describe('Radio hint', () => {
  it('describes the radio with its hint', () => {
    render(
      <RadioGroup aria-label="Plan">
        <Radio value="a" label="Free" hint="No card needed" />
      </RadioGroup>,
    )

    const radio = screen.getByRole('radio', { name: 'Free' })
    const id = radio.getAttribute('aria-describedby')

    expect(id).toBeTruthy()
    expect(document.getElementById(id!)?.textContent).toBe('No card needed')
  })

  it("keeps the consumer's own description next to the hint", () => {
    render(
      <RadioGroup aria-label="Plan">
        <span id="err">Pick one</span>
        <Radio value="a" label="Free" hint="No card" aria-describedby="err" />
      </RadioGroup>,
    )

    const radio = screen.getByRole('radio', { name: 'Free' })
    const ids = radio.getAttribute('aria-describedby')!.split(' ')

    expect(ids).toHaveLength(2)
    expect(ids).toContain('err')
  })

  it('names the hint button by its action, not by the hint text', () => {
    render(
      <RadioGroup aria-label="Plan">
        <Radio value="a" label="Free" hint="No card" />
      </RadioGroup>,
    )

    expect(
      screen.getByRole('button', { name: 'common.action.more_info' }),
    ).toBeTruthy()
  })
})
