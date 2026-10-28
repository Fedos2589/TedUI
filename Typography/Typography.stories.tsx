import type { ReactNode } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Typography, type TypographyVariant } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'UI-KIT/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'h7',
        'h8',
        'bh1',
        'bh2',
        'bh3',
        'bh4',
        'bh5',
        'bh6',
        'bh7',
        't1',
        't2',
        't3',
        't4',
        't5',
        't6',
      ],
    },
    color: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

const HEADING_SAMPLE = 'Lorem ipsum dolor sit amet consectetur'
const PARAGRAPH_SAMPLE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Typography variant="t1" color="greyscale.400">
      {title}
    </Typography>
    <div style={{ height: 1, background: 'var(--color-grey-200)' }} />
    {children}
  </div>
)

const SpecRow = ({
  variant,
  label,
  sample,
}: {
  variant: TypographyVariant
  label: string
  sample: string
}) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <Typography
      variant={variant}
      color="greyscale.black"
      style={{ width: 220, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant={variant} color="greyscale.400">
      {sample}
    </Typography>
  </div>
)

/** Mirrors the Design System Figma frame (node 22:534): Headings, Bold Headings, Paragraphs. */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 60,
        maxWidth: 1080,
      }}
    >
      <Section title="Headings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <SpecRow variant="h1" label="Heading H1" sample={HEADING_SAMPLE} />
          <SpecRow variant="h2" label="Heading H2" sample={HEADING_SAMPLE} />
          <SpecRow variant="h3" label="Heading H3" sample={HEADING_SAMPLE} />
          <SpecRow variant="h4" label="Heading H4" sample={HEADING_SAMPLE} />
          <SpecRow variant="h5" label="Heading H5" sample={HEADING_SAMPLE} />
          <SpecRow variant="h6" label="Heading H6" sample={HEADING_SAMPLE} />
          <SpecRow variant="h7" label="Heading H7" sample={HEADING_SAMPLE} />
          <SpecRow variant="h8" label="Heading H8" sample={HEADING_SAMPLE} />
        </div>
      </Section>

      <Section title="Bold Headings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <SpecRow
            variant="bh1"
            label="Bold Heading BH1"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh2"
            label="Bold Heading BH2"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh3"
            label="Bold Heading BH3"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh4"
            label="Bold Heading BH4"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh5"
            label="Bold Heading BH5"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh6"
            label="Bold Heading BH6"
            sample={HEADING_SAMPLE}
          />
          <SpecRow
            variant="bh7"
            label="Bold Heading BH7"
            sample={HEADING_SAMPLE}
          />
        </div>
      </Section>

      <Section title="Paragraphs">
        <div style={{ display: 'flex', gap: 38, flexWrap: 'wrap' }}>
          {(['t1', 't2', 't3', 't4', 't5', 't6'] as const).map((variant, i) => (
            <div
              key={variant}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                maxWidth: 260,
              }}
            >
              <Typography variant={variant} color="greyscale.black">
                {`Paragraph T${i + 1}`}
              </Typography>
              <Typography variant={variant} color="greyscale.400">
                {PARAGRAPH_SAMPLE}
              </Typography>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    variant: 't1',
    color: 'greyscale.black',
    children: 'Lorem ipsum dolor sit amet',
  },
}

export const WithCustomStyles: Story = {
  args: {
    variant: 't1',
    children: 'Typography with custom styles',
    style: {
      color: '#d32f2f',
      fontStyle: 'italic',
      textDecoration: 'underline',
    },
  },
}

export const Paragraph: Story = {
  args: {
    variant: 't1',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
}
