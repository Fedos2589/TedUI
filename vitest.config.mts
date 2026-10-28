import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // A component test asks for happy-dom with a `@vitest-environment` pragma;
    // everything else is pure model code and runs faster without a DOM.
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', 'storybook-static/**'],
  },
})
