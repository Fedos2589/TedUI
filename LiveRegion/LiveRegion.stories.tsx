import type { Meta, StoryObj } from '@storybook/react'
import { ComponentProps, useState } from 'react'
import { Button } from '../Button'
import { Stack } from '../_storybook/Stack'
import { Typography } from '../Typography'
import { LiveRegion } from './LiveRegion'

const meta: Meta<typeof LiveRegion> = {
  title: 'UI-KIT/LiveRegion',
  component: LiveRegion,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    politeness: { control: 'select', options: ['polite', 'assertive'] },
  },
  args: {
    message: 'Invalid code',
    politeness: 'assertive',
  },
}

export default meta
type Story = StoryObj<typeof LiveRegion>

const Demo = (props: ComponentProps<typeof LiveRegion>) => {
  const [nonce, setNonce] = useState(0)

  return (
    <Stack spacing={2} alignItems="center" style={{ maxWidth: 360 }}>
      <Typography variant="t3" color="greyscale.500" align="center">
        The region is visually hidden. Turn on VoiceOver or NVDA and press the
        button: the message is read out on every press, even when the text is
        the same.
      </Typography>
      <Button colorScheme="black" onClick={() => setNonce((v) => v + 1)}>
        Announce
      </Button>
      <Typography variant="t4" color="greyscale.400">
        Announced {nonce} times
      </Typography>
      <LiveRegion
        {...props}
        message={nonce ? props.message : ''}
        nonce={nonce}
      />
    </Stack>
  )
}

export const Default: Story = {
  render: (args) => <Demo {...args} />,
}

export const Polite: Story = {
  render: (args) => <Demo {...args} />,
  args: {
    message: 'Saved',
    politeness: 'polite',
  },
}
