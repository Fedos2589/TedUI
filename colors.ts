export const colors = {
  greyscale: {
    black: '#000000',
    600: '#343A42',
    500: '#545D6C',
    400: '#919CAD',
    300: '#C1C9D2',
    200: '#E2E6EB',
    100: '#F2F4F6',
    50: '#F8F9F9',
    white: '#ffffff',
  },
  greyBlue: {
    600: '#4E5D83',
    500: '#6B7CA8',
    400: '#919FC7',
    300: '#C4D2F0',
    200: '#DDE8FB',
    100: '#ECF2FF',
    50: '#F6F9FF',
  },
  blue: {
    600: '#091473',
    500: '#081791',
    400: '#2333B6',
    300: '#4959DC',
    200: '#B7BFFF',
    100: '#E5E8FF',
    50: '#F0F3FF',
  },
  green: {
    600: '#00582E',
    500: '#007B40',
    400: '#1CA04C',
    300: '#37C269',
    200: '#91E1AE',
    100: '#D5F5E1',
    50: '#E8FCEC',
  },
  emerald: {
    600: '#005855',
    500: '#007B6A',
    400: '#1CA086',
    300: '#38BEA6',
    200: '#91E1D4',
    100: '#D5F5F1',
    50: '#E8FCF9',
  },
  red: {
    600: '#780000',
    500: '#A51919',
    400: '#DA2D2D',
    300: '#FF4343',
    200: '#FFB1B1',
    100: '#FFE3E3',
    50: '#FFF1F1',
  },
  orange: {
    600: '#8D2F00',
    500: '#AD4900',
    400: '#DB5E04',
    300: '#FA7413',
    200: '#FFC499',
    100: '#FFDEC6',
    50: '#FFF4EC',
  },
  yellow: {
    600: '#E49500',
    500: '#EDB500',
    400: '#FCD819',
    300: '#FFE350',
    200: '#FFED8C',
    100: '#FFF7C9',
    50: '#FFF9DE',
  },
  beige: {
    600: '#998672',
    500: '#BB9D81',
    400: '#D8B493',
    300: '#F7D6A5',
    200: '#FAE7CA',
    100: '#FFF4E4',
    50: '#FFF7EC',
  },
  gainsborough: {
    600: '#86847F',
    500: '#AAA69B',
    400: '#C6C4BD',
    300: '#DCDBD7',
    200: '#EAE9E6',
    100: '#F3F2EE',
    50: '#FBFAF7',
  },
}

// Names of the `--color-*` CSS tokens in tokens.scss, for props that pick a color
// (`<Typography color="grey-500">`). Shades and groups match the SCSS lists in
// styles/_colorTokens.scss; Typography/textColor.test.ts keeps all three in sync.
const colorGroups = [
  'grey',
  'grey-blue',
  'blue',
  'green',
  'emerald',
  'red',
  'orange',
  'yellow',
  'beige',
  'gainsborough',
] as const
const colorShades = [50, 100, 200, 300, 400, 500, 600] as const

export type ColorToken =
  | 'bw-black'
  | 'bw-white'
  | `${(typeof colorGroups)[number]}-${(typeof colorShades)[number]}`

export const colorTokens: readonly ColorToken[] = [
  'bw-black',
  'bw-white',
  ...colorGroups.flatMap((group) =>
    colorShades.map((shade) => `${group}-${shade}` as const),
  ),
]
