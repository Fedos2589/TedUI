import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          globals: true,
          // A component test asks for happy-dom with a `@vitest-environment` pragma;
          // everything else is pure model code and runs faster without a DOM.
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['**/node_modules/**', 'storybook-static/**'],
        },
      },
      {
        extends: true,
        // Без явного списка Vite переоптимизирует эти пакеты посреди прогона,
        // перезагружает страницу, и часть файлов стори падает на импорте.
        optimizeDeps: {
          include: [
            'react/jsx-runtime',
            '@storybook/addon-a11y/preview',
            '@storybook/react-vite',
          ],
        },
        plugins: [
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          exclude: ['**/node_modules/**', 'storybook-static/**'],
          setupFiles: ['./.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
