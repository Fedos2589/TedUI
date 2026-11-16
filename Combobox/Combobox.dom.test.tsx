// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('keeps emptyValue={null} as "show nothing"', async () => {
    render(
      <Combobox
        options={[]}
        inputValue="zzz"
        emptyValue={null}
        trigger={trigger}
      />,
    )

    fireEvent.click(screen.getByRole('combobox', { name: 'Pick' }))

    const popup = await screen.findByRole('dialog')
    await waitFor(() => expect(popup.hasAttribute('data-empty')).toBe(true))
    // let the empty slot render before asserting nothing is in it
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(screen.queryByText('common.text.noOptions')).toBeNull()
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

describe('mobile Combobox keyboard', () => {
  const setup = () =>
    render(<Combobox options={['a', 'b']} forceMobile label="Pick" />)

  it('is a combobox that announces its popup', () => {
    setup()
    const field = screen.getByRole('combobox')
    expect(field.getAttribute('aria-haspopup')).toBe('dialog')
    expect(field.getAttribute('aria-expanded')).toBe('false')
  })

  it.each(['Enter', ' ', 'ArrowDown'])('opens with %j', async (key) => {
    setup()
    const field = screen.getByRole('combobox')
    field.focus()

    fireEvent.keyDown(field, { key })

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(field.getAttribute('aria-expanded')).toBe('true')
  })

  it('gives focus back to the field when closed, and opens again', async () => {
    setup()
    const field = screen.getByRole('combobox')
    fireEvent.keyDown(field, { key: 'Enter' })

    fireEvent.click(
      await screen.findByRole('button', { name: 'common.action.close' }),
    )

    await waitFor(() => expect(document.activeElement).toBe(field))
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})

describe('mobile Combobox focus after picking', () => {
  it('returns focus to the field when an option is chosen', async () => {
    render(<Combobox options={['a', 'b']} forceMobile label="Pick" />)
    const field = screen.getByRole('combobox')
    field.focus()
    fireEvent.keyDown(field, { key: 'Enter' })

    fireEvent.click(await screen.findByRole('option', { name: 'a' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.activeElement).toBe(field)
  })

  it('points aria-controls at the open dialog', async () => {
    render(<Combobox options={['a']} forceMobile label="Pick" />)
    const field = screen.getByRole('combobox')
    expect(field.getAttribute('aria-controls')).toBeNull()

    fireEvent.keyDown(field, { key: 'Enter' })

    const dialog = await screen.findByRole('dialog')
    expect(field.getAttribute('aria-controls')).toBe(dialog.id)
  })
})
