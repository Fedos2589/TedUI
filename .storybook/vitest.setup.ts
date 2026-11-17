import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as previewAnnotations from './preview'

// Под vitest стори рендерится не в `#storybook-root` (его создаёт только
// Storybook), поэтому `a11y.context` из preview не находит ни одного
// элемента и axe падает на каждой стори. Здесь проверяем весь body:
// в iframe теста кроме стори в нём ничего нет (порталы Popover/Toast/Tooltip
// тоже в body, так что здесь проверяется чуть больше, чем в панели Accessibility).
// Файл не удалять: без него все стори падают на отсутствующем #storybook-root.
// Список аннотаций ручной — новый аддон с preview надо добавить сюда.
setProjectAnnotations([
  a11yAddonAnnotations,
  previewAnnotations,
  { parameters: { a11y: { context: 'body' } } },
])
