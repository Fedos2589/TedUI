import React from 'react'
import { isMockFunction } from 'storybook/test'
import { ToastProvider } from '../Toast/Toast'
import { colorsUIKIT } from '../colors'
import { initStorybookI18n } from './i18n'
import '../tokens.scss'
import './preview.scss'

initStorybookI18n()

export const parameters = {
  // Стори — изолированный компонент, не страница: правила про landmarks и h1
  // здесь всегда ложные. Контраст — на пересмотре палитры у дизайнеров,
  // поэтому пока «требует проверки», а не нарушение.
  a11y: {
    context: '#storybook-root',
    config: {
      rules: [
        { id: 'region', enabled: false },
        { id: 'landmark-one-main', enabled: false },
        { id: 'page-has-heading-one', enabled: false },
        { id: 'color-contrast', reviewOnFail: true },
      ],
    },
    test: 'error',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// Спай из fn() отправляет в Actions событие как есть, и у React-события
// остаётся `view` = window. Сериализатор идёт по нему в window.parent, упирается
// в кросс-доменный iframe Figma из панели Design и молча роняет весь action —
// поэтому у стори с `parameters.design` клики не логировались. Сам Storybook
// чистит `view` только у action(), не у fn().
const withoutView = (value: unknown) => {
  if (!value || typeof value !== 'object' || !('nativeEvent' in value)) {
    return value
  }
  const copy = Object.create(
    Object.getPrototypeOf(value),
    Object.getOwnPropertyDescriptors(value),
  )
  Object.defineProperty(copy, 'view', { value: null })
  return copy
}

const safeSpies = new WeakMap<object, (...args: unknown[]) => unknown>()

const safeArg = (value: unknown, depth = 0): unknown => {
  if (isMockFunction(value)) {
    let safe = safeSpies.get(value)
    if (!safe) {
      safe = (...args: unknown[]) => value(...args.map(withoutView))
      safeSpies.set(value, safe)
    }
    return safe
  }
  if (depth > 3 || !value || typeof value !== 'object') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => safeArg(item, depth + 1))
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    return value
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, safeArg(item, depth + 1)]),
  )
}

export const decorators = [
  (
    Story: (update?: { args: Record<string, unknown> }) => React.ReactNode,
    context: { args: Record<string, unknown> },
  ) => Story({ args: safeArg(context.args) as Record<string, unknown> }),
  (Story: () => React.ReactNode) => (
    <div
      style={{ minHeight: '100vh', background: colorsUIKIT.greyscale.white }}
    >
      <Story />
      <ToastProvider />
    </div>
  ),
]
