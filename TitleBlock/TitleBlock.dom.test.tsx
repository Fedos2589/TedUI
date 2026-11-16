// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TitleBlock } from './TitleBlock'
import { NavMobileHeader } from '../NavMobileHeader/NavMobileHeader'
import { SuccessScreen } from '../SuccessScreen/SuccessScreen'

const cases = [
  [
    'TitleBlock',
    (level?: 1 | 2) => <TitleBlock title="Hi" headingLevel={level} />,
  ],
  [
    'NavMobileHeader',
    (level?: 1 | 2) => <NavMobileHeader title="Hi" headingLevel={level} />,
  ],
  [
    'SuccessScreen',
    (level?: 1 | 2) => (
      <SuccessScreen
        image="x.png"
        title="Hi"
        description="d"
        actionLabel="Go"
        onAction={vi.fn()}
        headingLevel={level}
      />
    ),
  ],
] as const

describe.each(cases)('%s headingLevel', (_name, ui) => {
  it('renders the title as that heading level', () => {
    render(ui(1))
    expect(screen.getByRole('heading', { level: 1, name: 'Hi' })).toBeTruthy()
  })

  it('renders no heading without the prop', () => {
    render(ui())
    expect(screen.queryByRole('heading')).toBeNull()
  })
})
