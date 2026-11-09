import type { StorybookConfig } from '@storybook/react-vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: false,
  },
  // Пакет отдаёт .svg как React-компоненты — ровно так же, как это делает
  // svgr в приложении. Компоненты импортируют их дефолтным импортом
  // (`import Star from './star.svg'`), а vite-plugin-svgr с 4.x отдаёт
  // дефолтом URL, если не попросить обратное через exportType. Без этой
  // строки иконки молча превратятся в пустоту: ошибки сборки не будет.
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          exportType: 'default',
          titleProp: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false } },
              },
            ],
          },
        },
      }),
    ]
    return viteConfig
  },
}

export default config
