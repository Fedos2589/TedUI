import type { CSSProperties } from 'react'

import { colorsUIKIT } from '../colors'

/**
 * Pure helpers that recreate the slice of MUI's styling system the old
 * `@mui/material` Typography exposed to consumers, so we can drop MUI without
 * changing any call site. Colors resolve against the UI-KIT tokens
 * (`colorsUIKIT` / `tokens.scss`); everything else mirrors MUI's behaviour
 * (8px spacing scale, `getValue` raw-string fallback, etc.).
 */

/** MUI's default spacing factor (theme has no `spacing` override). */
const SPACING_UNIT = 8

/**
 * Top-level semantic palette names MUI's Typography mapped to a concrete color.
 * `primary`/`secondary` come straight from UI-KIT tokens; `success`/`error`
 * keep the values the project's MUI theme used (only a handful of call sites).
 */
const SEMANTIC_COLORS: Record<string, string> = {
  primary: colorsUIKIT.blue[300], // #4959DC — theme palette.primary.main
  secondary: colorsUIKIT.greyscale.black, // #000 — theme palette.secondary.main
  success: '#0DA95E', // theme palette.success.main
  error: '#d32f2f', // MUI default error.main
}

/** MUI's default `grey` palette — a few legacy `color="grey.x"` call sites lean on it. */
const MUI_GREY: Record<string, string> = {
  '400': '#bdbdbd',
  '500': '#9e9e9e',
}

/**
 * Resolve a Typography `color` prop the way MUI did:
 * 1. semantic name (`primary`, `secondary`, …) → mapped color,
 * 2. `group.shade` path → UI-KIT token (or MUI grey for the legacy `grey.*`),
 * 3. anything else (hex, `rgba()`, CSS keyword, or an unknown string) → passed
 *    through verbatim — the browser renders valid colors and ignores the rest
 *    (falling back to the inherited color), exactly like before.
 */
function resolveColor(value?: string): string | undefined {
  if (!value) return undefined
  if (value === 'inherit') return 'inherit'
  if (value in SEMANTIC_COLORS) return SEMANTIC_COLORS[value]

  if (value.includes('.')) {
    const [group, shade] = value.split('.')
    const groupMap = (colorsUIKIT as Record<string, Record<string, string>>)[
      group
    ]
    if (groupMap && groupMap[shade] != null) return groupMap[shade]
    if (group === 'grey' && MUI_GREY[shade]) return MUI_GREY[shade]
    return value
  }

  return value
}

/** MUI spacing transform: numbers scale by 8px, strings are literal. */
function spacing(value: number | string): string {
  return typeof value === 'number' ? `${value * SPACING_UNIT}px` : value
}

/** MUI sizing transform: `|n| <= 1` → percentage, otherwise px; strings are literal. */
function sizing(value: number | string): string {
  if (typeof value !== 'number') return value
  return Math.abs(value) <= 1 && value !== 0 ? `${value * 100}%` : `${value}px`
}

type SpacingValue = number | string

interface TypographyStyleInput {
  color?: string
  align?: CSSProperties['textAlign'] | 'inherit'
  textAlign?: CSSProperties['textAlign']
  mb?: SpacingValue
  mt?: SpacingValue
  width?: number | string
  fontSize?: number | string
  fontWeight?: CSSProperties['fontWeight']
  textTransform?: CSSProperties['textTransform']
  whiteSpace?: CSSProperties['whiteSpace']
  style?: CSSProperties
}

/**
 * Build the inline style for a Typography element. An explicit `style` wins
 * over the system props.
 */
export function buildTypographyStyle({
  color,
  align,
  textAlign,
  mb,
  mt,
  width,
  fontSize,
  fontWeight,
  textTransform,
  whiteSpace,
  style,
}: TypographyStyleInput): CSSProperties {
  const base: CSSProperties = {}

  const resolvedColor = resolveColor(color)
  if (resolvedColor != null) base.color = resolvedColor

  const resolvedAlign = textAlign ?? align
  if (resolvedAlign)
    base.textAlign = resolvedAlign as CSSProperties['textAlign']

  if (mb != null) base.marginBottom = spacing(mb)
  if (mt != null) base.marginTop = spacing(mt)
  if (width != null) base.width = sizing(width)
  if (fontSize != null)
    base.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize
  if (fontWeight != null) base.fontWeight = fontWeight
  if (textTransform) base.textTransform = textTransform
  if (whiteSpace) base.whiteSpace = whiteSpace

  return { ...base, ...style }
}
