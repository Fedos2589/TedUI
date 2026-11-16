import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as previewAnnotations from './preview'

// Под vitest стори рендерится не в `#storybook-root` (его создаёт только
// Storybook), поэтому `a11y.context` из preview не находит ни одного
// элемента и axe падает на каждой стори. Здесь проверяем весь body:
// в iframe теста кроме стори в нём ничего нет.
setProjectAnnotations([
  a11yAddonAnnotations,
  previewAnnotations,
  { parameters: { a11y: { context: 'body' } } },
])
