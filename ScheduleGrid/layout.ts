export type Span = { startMinute: number; endMinute: number }
export type LayoutInput = Span & { id: string }
export type Placed = {
  id: string
  top: number
  height: number
  lane: number
  lanes: number
}

export const layoutItems = (items: LayoutInput[], range: Span): Placed[] => {
  const length = range.endMinute - range.startMinute
  const clipped = items
    .map((i) => ({
      id: i.id,
      start: Math.max(i.startMinute, range.startMinute),
      end: Math.min(i.endMinute, range.endMinute),
    }))
    .filter((i) => i.end > i.start)
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const placed: Placed[] = []
  let group: { item: (typeof clipped)[number]; lane: number }[] = []
  let laneEnds: number[] = []

  const flush = () => {
    for (const { item, lane } of group) {
      placed.push({
        id: item.id,
        top: (item.start - range.startMinute) / length,
        height: (item.end - item.start) / length,
        lane,
        lanes: laneEnds.length,
      })
    }
    group = []
    laneEnds = []
  }

  let groupEnd = -Infinity
  for (const item of clipped) {
    if (item.start >= groupEnd) flush()
    let lane = laneEnds.findIndex((end) => end <= item.start)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = item.end
    group.push({ item, lane })
    groupEnd = Math.max(groupEnd, item.end)
  }
  flush()
  return placed
}

export const visibleRange = (items: Span[], fallback: Span): Span => {
  if (items.length === 0) return fallback
  return {
    startMinute:
      Math.floor(Math.min(...items.map((i) => i.startMinute)) / 60) * 60,
    endMinute: Math.ceil(Math.max(...items.map((i) => i.endMinute)) / 60) * 60,
  }
}

// The minute under a point `fraction` (0–1) of the way down the range, rounded down to the step.
export const minuteAt = (fraction: number, range: Span, step: number) => {
  const raw =
    range.startMinute + fraction * (range.endMinute - range.startMinute)
  const rounded =
    range.startMinute + Math.floor((raw - range.startMinute) / step) * step
  return Math.min(Math.max(rounded, range.startMinute), range.endMinute - step)
}
