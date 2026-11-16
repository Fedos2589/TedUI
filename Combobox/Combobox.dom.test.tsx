// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Combobox } from './Combobox'

const trigger = <button aria-label="Pick">Pick</button>

describe('Combobox names', () => {
  it('names the popup search field of a custom trigger', async () => {
    render(<Combobox options={['a', 'b']} trigger={trigger} />)

    fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }))

    expect(
      await screen.findByRole('combobox', {
        name: 'common.placeholder.search',
      }),
    ).toBeTruthy()
  })

  it('translates the empty state', async () => {
    render(<Combobox options={[]} inputValue="zzz" trigger={trigger} />)

    fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }))

    expect(await screen.findByText('common.text.noOptions')).toBeTruthy()
  })

  // The attribute, not the computed name: Modal still renders an empty
  // Dialog.Title that aria-labelledby points at, so the name only resolves
  // once Modal renders the title conditionally (plan task 8).
  it('labels the mobile sheet when there is no label', async () => {
    render(<Combobox options={['a']} forceMobile trigger={trigger} />)

    fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog.getAttribute('aria-label')).toBe('common.action.show_options')
  })
})
