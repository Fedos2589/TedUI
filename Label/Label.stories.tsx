import type { Meta, StoryObj } from '@storybook/react'
import { ReactNode } from 'react'
import { RiInformationLine, RiCheckLine } from '@remixicon/react'
import { Label, LabelColorScheme, LabelSize, LabelVariant } from './Label'

const COLOR_SCHEMES: LabelColorScheme[] = [
  'grey',
  'black',
  'blue',
  'green',
  'red',
  'orange',
]
const VARIANTS: LabelVariant[] = ['soft', 'filled']
const SIZES: LabelSize[] = [20, 24, 28, 32, 36, 40]

// Human-readable token mapping for the gallery captions (mirrors COLOR_STYLES in Label.tsx).
const TOKEN_CAPTIONS: Record<LabelColorScheme, Record<LabelVariant, string>> = {
  grey: { soft: 'greyscale.100 · 500', filled: 'greyscale.500 · white' },
  black: {
    soft: 'white · greyscale.600 + shadow',
    filled: 'greyscale.600 · white + shadow',
  },
  blue: { soft: 'greyBlue.100 · blue.300', filled: 'blue.300 · white' },
  green: { soft: 'green.50 · green.400', filled: 'green.300 · white' },
  red: { soft: 'red.50 · red.300', filled: 'red.300 · white' },
  orange: { soft: 'orange.50 · orange.300', filled: 'orange.300 · white' },
}

const meta: Meta<typeof Label> = {
  title: 'UI-KIT/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    variant: 'filled',
    colorScheme: 'grey',
    size: 28,
    startIcon: <RiInformationLine />,
    endIcon: <RiCheckLine />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    colorScheme: { control: 'select', options: COLOR_SCHEMES },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Playground: Story = {}

// Labeled colour × variant matrix on a grey canvas so the white (`black`/`soft`)
// chip and the subtle `black` shadow are both visible. Each cell shows its tokens.
export const Gallery: Story = {
  render: (args) => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'max-content 1fr 1fr',
        gap: 16,
        alignItems: 'center',
        padding: 24,
        borderRadius: 12,
        background: '#EEF0F2',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <span />
      {VARIANTS.map((variant) => (
        <span
          key={variant}
          style={{ fontSize: 12, fontWeight: 600, color: '#545D6C' }}
        >
          {variant}
        </span>
      ))}

      {COLOR_SCHEMES.map((colorScheme) => (
        <Row key={colorScheme}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#343A42' }}>
            {colorScheme}
          </span>
          {VARIANTS.map((variant) => (
            <Cell key={variant} caption={TOKEN_CAPTIONS[colorScheme][variant]}>
              <Label {...args} variant={variant} colorScheme={colorScheme} />
            </Cell>
          ))}
        </Row>
      ))}
    </div>
  ),
}

const Row = ({ children }: { children: ReactNode }) => <>{children}</>

const Cell = ({
  caption,
  children,
}: {
  caption: string
  children: ReactNode
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 8,
      padding: 16,
      borderRadius: 8,
      background: '#F8F9F9',
      border: '1px solid #E2E6EB',
    }}
  >
    {children}
    <span style={{ fontSize: 11, color: '#919CAD' }}>{caption}</span>
  </div>
)

// All six sizes for the selected scheme/variant — note icon scaling (12→12→16→16→16→20).
export const AllSizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      {SIZES.map((size) => (
        <Label key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const LabelOnly: Story = {
  args: {
    startIcon: undefined,
    endIcon: undefined,
  },
}

export const StartIconOnly: Story = {
  args: {
    endIcon: undefined,
  },
}
