# ted-ui

Дизайн-система Ted. В npm пакет не публикуется: приложение ставит его прямо из
этого репозитория по git-тегу.

Пакет отдаёт исходники (`.tsx` + `.module.scss`), без сборки. Потребитель
компилирует их сам — в Next это `transpilePackages: ['ted-ui']` в
`next.config.js`. Поэтому хеши CSS-модулей и порядок подключения стилей те же,
что и до выноса.

## Подключение

Пакет ставится из публичного репозитория [Fedos2589/TedUI](https://github.com/Fedos2589/TedUI)
по тегу версии:

```bash
npm install github:Fedos2589/TedUI#v0.1.0
```

В `package.json` приложения появится `"ted-ui": "github:Fedos2589/TedUI#v0.1.0"`.
Без тега npm поставит текущий `main` — так не делать: тогда версия кита в приложении
зависит от того, когда выполнили `npm install`.

Дальше приложение настраивается один раз: `transpilePackages`, svgr для `*.svg`,
`sass`, `ted-ui/tokens.scss`, шрифт Montserrat, `registerUIKitTranslations(i18n)`,
`ToastProvider` и базовые ресеты. Что именно и зачем — в таблице
[«Setup an app needs once»](docs/agents/usage.md#setup-an-app-needs-once).

Импорты — по пути файла, без барреля: `ted-ui/Button/Button`,
`ted-ui/colors`, `ted-ui/tokens.scss`.

### Зависимости на стороне приложения

Всё, что киту нужно в рантайме, он тянет сам — кроме `dayjs`: он нужен только
`DatePicker` и лежит в `peerDependencies` как optional. Приложению с пикером надо
поставить его самому (`npm i dayjs`) и импортировать компонент по пути папки
(`ted-ui/DatePicker`) — из корневого `index.tsx` он намеренно не экспортируется,
иначе приложение без dayjs сломалось бы на любом импорте из корня. Подробности для
агентов — в [`docs/agents/usage.md`](docs/agents/usage.md).

## Релиз

1. Изменения вливаются в `main` через PR.
2. Поднять `version` в `package.json`, поставить тег `vX.Y.Z` и запушить его.
3. В web поменять тег в зависимости и выполнить `npm install ted-ui`,
   чтобы обновился `package-lock.json`.

## Разработка вместе с приложением

```bash
git clone https://github.com/Fedos2589/TedUI.git   # рядом с приложением
# в приложении
npm install --no-save --install-links ../TedUI
```

`--install-links` копирует кит в `node_modules` приложения, а не делает симлинк: так
файлы кита берут `react`, `react-i18next` и `i18next` из приложения. С `npm link` они
подхватывают копии из клона кита — «Invalid hook call» и ключи вместо текстов.
После каждой правки в ките команду нужно повторить. `--no-save` не трогает
`package.json` и lockfile; вернуть версию из тега — `npm ci` в приложении.

## Команды

- `npm run storybook` — Storybook на :6007
- `npm run typecheck` — tsgo
- `npm run lint` — ESLint (+ prettier)

## Правила для агентов

- [`AGENTS.md`](AGENTS.md) — для тех, кто правит сам кит (Claude Code читает его через
  `CLAUDE.md`). Развязка с приложениями, устройство компонента, стили, брекпоинты,
  строки, доступность, зависимости, релиз.
- `.claude/skills/` — пошаговые процедуры к этим правилам: `add-component` (новый
  компонент или вариант) и `release` (версия, тег и обновление кита в web).
- [`docs/agents/usage.md`](docs/agents/usage.md) — для агентов в приложениях, которые
  пользуются китом. Файл едет внутри пакета; приложение подключает его строкой
  `@node_modules/ted-ui/docs/agents/usage.md` в своём `CLAUDE.md` — так правила
  всегда соответствуют установленной версии кита.
