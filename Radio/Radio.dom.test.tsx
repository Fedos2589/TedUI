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
})
