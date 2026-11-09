import js from '@eslint/js'
import { fixupPluginRules } from '@eslint/compat'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

// Пресет jsx-a11y с подменённой строгостью: опции правил сохраняем, трогаем
// только severity (в recommended почти всё error). Выключенные там правила
// оставляем выключенными.
const a11yRules = (severity) =>
  Object.fromEntries(
    Object.entries(jsxA11yPlugin.flatConfigs.recommended.rules).map(
      ([rule, value]) => {
        const options = Array.isArray(value) ? value.slice(1) : []
        const current = Array.isArray(value) ? value[0] : value

        if (current === 'off' || current === 0) {
          return [rule, value]
        }

        return [rule, options.length ? [severity, ...options] : severity]
      },
    ),
  )

export default [
  // Replaces .eslintignore
  {
    ignores: [
      'node_modules/**',
      'storybook-static/**',
      '**/*.stories.*',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript: sets up TS parser globally + recommended TS rules for .ts/.tsx
  // configs['flat/recommended'] is an array of 3 config objects
  ...tsEslintPlugin.configs['flat/recommended'],

  // React recommended — wrapped via fixupPluginRules for ESLint v10 compatibility
  // (eslint-plugin-react v7 still uses some deprecated context APIs)
  {
    ...reactPlugin.configs.flat.recommended,
    plugins: {
      react: fixupPluginRules(reactPlugin),
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // a11y — error: регресс в примитивах расходится по всем экранам сразу.
  // Осознанные исключения помечены eslint-disable с причиной.
  {
    ...jsxA11yPlugin.flatConfigs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: a11yRules('error'),
  },

  // Prettier: disables formatting-related rules that conflict with prettier
  prettierConfig,

  // Main project config for all JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/ignore': ['\\.scss$', '\\.css$'],
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.jpg'] },
        typescript: {},
      },
    },
    rules: {
      // Пустой catch теперь означает «ошибку намеренно глотаем»: отправлять её
      // больше некуда, а сам catch нужен, чтобы она не всплывала выше.
      'no-empty': ['error', { allowEmptyCatch: true }],
      'import/no-duplicates': 'error',
      '@typescript-eslint/no-namespace': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-children-prop': 'off',
      'no-console': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react/jsx-key': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^(action|inject|observer|observable|computed)$',
        },
      ],
      'react/display-name': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      'react/no-string-refs': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/no-find-dom-node': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'object-shorthand': ['error', 'always'],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/export': 'off',
      'react/no-unknown-property': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      'no-unsafe-optional-chaining': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Allow require() in config files (replaces .eslintrc.js override)
  {
    files: ['*.config.js', '*.config.mjs', '*.config.cjs', 'eslint.config.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
