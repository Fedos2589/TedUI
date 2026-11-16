// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { TagsInput } from './TagsInput'

// No i18n instance here, so the remove button's name is the key plus the tag.
const Controlled = ({
  initial = [],
  ...props
}: { initial?: string[] } & Partial<
  React.ComponentProps<typeof TagsInput>
>) => {
  const [value, setValue] = useState(initial)
  return <TagsInput value={value} onChange={setValue} {...props} />
}

const type = (input: HTMLElement, text: string) => {
  fireEvent.change(input, { target: { value: text } })
  fireEvent.keyDown(input, { key: 'Enter' })
}

describe('TagsInput focus at the limit', () => {
  it('moves focus to the last remove button when the limit is reached, and back to the field after removing', () => {
    render(<Controlled maxTags={2} />)
    const input = screen.getByRole('textbox')
    input.focus()
    type(input, 'a')
    type(screen.getByRole('textbox'), 'b')

    const remove = screen.getByRole('button', {
      name: 'common.button.remove b',
    })
    expect(document.activeElement).toBe(remove)

    fireEvent.click(remove)

    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })
})

describe('TagsInput required', () => {
  it('is satisfied by any tag, so the field is required only while empty', () => {
    const { rerender } = render(
      <TagsInput value={['a']} onChange={vi.fn()} required />,
    )
    expect((screen.getByRole('textbox') as HTMLInputElement).required).toBe(
      false,
    )

    rerender(<TagsInput value={[]} onChange={vi.fn()} required />)
    expect((screen.getByRole('textbox') as HTMLInputElement).required).toBe(
      true,
    )
  })
})

describe('TagsInput when the parent does not apply the change', () => {
  it('does not steal focus from the field on later renders', () => {
    const { rerender } = render(
      <TagsInput value={['a']} onChange={vi.fn()} maxTags={2} />,
    )
    const input = screen.getByRole('textbox')
    input.focus()
    type(input, 'b') // parent ignores it: value stays ['a']

    fireEvent.change(input, { target: { value: 'c' } })
    rerender(<TagsInput value={['a']} onChange={vi.fn()} maxTags={2} />)

    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })
})
