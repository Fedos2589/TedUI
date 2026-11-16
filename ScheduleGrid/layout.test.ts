import { describe, expect, it } from 'vitest'
import { layoutItems, visibleRange } from './layout'

const range = { startMinute: 8 * 60, endMinute: 20 * 60 }
const item = (id: string, startMinute: number, endMinute: number) => ({
  id,
  startMinute,
  endMinute,
})
const byId = (result: ReturnType<typeof layoutItems>) =>
  Object.fromEntries(result.map((r) => [r.id, r]))

describe('layoutItems', () => {
  it('puts items that do not overlap in one lane', () => {
    const r = byId(
      layoutItems([item('a', 480, 540), item('b', 540, 600)], range),
    )
    expect(r.a).toMatchObject({ lane: 0, lanes: 1 })
    expect(r.b).toMatchObject({ lane: 0, lanes: 1 })
  })

  it('gives top and height as fractions of the range', () => {
    const [a] = layoutItems([item('a', 8 * 60 + 180, 8 * 60 + 360)], range)
    expect(a.top).toBeCloseTo(0.25)
    expect(a.height).toBeCloseTo(0.25)
  })

  it('puts three mutually overlapping items in 3 lanes', () => {
    const r = layoutItems(
      [item('a', 600, 700), item('b', 620, 700), item('c', 640, 700)],
      range,
    )
    expect(r.map((x) => x.lane).sort()).toEqual([0, 1, 2])
    expect(r.every((x) => x.lanes === 3)).toBe(true)
  })

  it('uses 2 lanes when A–B and B–C overlap but A–C do not', () => {
    const r = byId(
      layoutItems(
        [item('a', 600, 660), item('b', 640, 720), item('c', 700, 760)],
        range,
      ),
    )
    expect(r.a).toMatchObject({ lane: 0, lanes: 2 })
    expect(r.b).toMatchObject({ lane: 1, lanes: 2 })
    expect(r.c).toMatchObject({ lane: 0, lanes: 2 })
  })

  it('does not widen a separate group because another group has more lanes', () => {
    const r = byId(
      layoutItems(
        [item('a', 600, 660), item('b', 600, 660), item('c', 900, 960)],
        range,
      ),
    )
    expect(r.c).toMatchObject({ lane: 0, lanes: 1 })
  })

  it('clips an item past the range end and drops one outside', () => {
    const r = byId(
      layoutItems(
        [item('a', 19 * 60, 22 * 60), item('b', 21 * 60, 22 * 60)],
        range,
      ),
    )
    expect(r.a.top + r.a.height).toBeCloseTo(1)
    expect(r.b).toBeUndefined()
  })
})

describe('visibleRange', () => {
  it('spans from the earliest start to the latest end, rounded out to whole hours', () => {
    expect(
      visibleRange(
        [item('a', 9 * 60 + 30, 10 * 60), item('b', 12 * 60, 13 * 60 + 15)],
        { startMinute: 0, endMinute: 60 },
      ),
    ).toEqual({
      startMinute: 9 * 60,
      endMinute: 14 * 60,
    })
  })

  it('falls back when there are no items', () => {
    const fallback = { startMinute: 480, endMinute: 1200 }
    expect(visibleRange([], fallback)).toBe(fallback)
  })
})
