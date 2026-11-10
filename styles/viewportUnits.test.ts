import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { expect, test } from 'vitest'

const ROOT = join(__dirname, '..')
const SKIP = new Set(['node_modules', 'storybook-static', '.storybook', '.git'])

function* sourceFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* sourceFiles(path)
    else if (/\.(scss|tsx)$/.test(entry.name)) yield path
  }
}

// `vh` is the layout viewport with the browser bars hidden: on phones it is
// taller than the screen while the bars show, and ignores the on-screen
// keyboard, so a 100vh box overflows. Use dvh (follows the bars and, with
// interactive-widget=resizes-content, the keyboard), svh or lvh.
test('no plain vh units in the kit', () => {
  const offenders: string[] = []
  for (const file of sourceFiles(ROOT)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (/(?<![a-z])\d*\.?\d+vh\b/.test(line))
          offenders.push(`${relative(ROOT, file)}:${index + 1}: ${line.trim()}`)
      })
  }
  expect(offenders).toEqual([])
})
