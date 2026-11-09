import { readFileSync } from 'node:fs'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

import { colorTokens } from '../colors'

const tokensScss = readFileSync(
  new URL('../tokens.scss', import.meta.url),
  'utf8',
)
const typographyCss = compile(
  new URL('./Typography.module.scss', import.meta.url).pathname,
  {
    loadPaths: [new URL('..', import.meta.url).pathname],
  },
).css

describe('Typography color tokens', () => {
  it('covers every --color-* token in tokens.scss and nothing else', () => {
    const declared = [...tokensScss.matchAll(/--color-([a-z-]+-?\d*):/g)].map(
      (m) => m[1],
    )
    expect([...colorTokens].sort()).toEqual([...new Set(declared)].sort())
  })

  it('has a class per token that reads the token', () => {
    for (const token of colorTokens) {
      expect(typographyCss).toContain(
        `.color-${token} {\n  color: var(--color-${token});`,
      )
    }
  })
})
