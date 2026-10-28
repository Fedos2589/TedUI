import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { RiMoreFill } from '@remixicon/react'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { ButtonWithTooltip, ButtonWithTooltipProps } from './index'

const meta: Meta<typeof ButtonWithTooltip> = {
  title: 'UI-KIT/ButtonWithTooltip',
  component: ButtonWithTooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onToggle: fn(),
    onClose: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ButtonWithTooltip>

const Menu = (props: { onClose: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
    {['Edit', 'Share', 'Report'].map((item) => (
      <Button
        key={item}
        colorScheme="white"
        align="left"
        fullWidth
        onClick={props.onClose}
      >
        <Typography variant="t3" color="black">
          {item}
        </Typography>
      </Button>
    ))}
  </div>
)

const Demo = (
  props: Partial<ButtonWithTooltipProps> & { defaultOpen?: boolean },
) => {
  const [open, setOpen] = useState(props.defaultOpen ?? false)
  const close = () => {
    setOpen(false)
    props.onClose?.()
  }

  return (
    <ButtonWithTooltip
      {...props}
      isOpen={open}
      onToggle={() => {
        setOpen((v) => !v)
        props.onToggle?.()
      }}
      onClose={close}
      tooltipContent={<Menu onClose={close} />}
      modalContent={<Menu onClose={close} />}
    >
      {props.fullWidth ? (
        <Button colorScheme="white" align="left" fullWidth>
          <Typography variant="t3" color="black">
            Account
          </Typography>
        </Button>
      ) : (
        <Button colorScheme="white" aria-label="More">
          <RiMoreFill size={20} />
        </Button>
      )}
    </ButtonWithTooltip>
  )
}

export const Default: Story = {
  render: (args) => <Demo {...args} modalTitle="Actions" />,
}

export const Placement: Story = {
  render: (args) => (
    <Demo
      {...args}
      modalTitle="Actions"
      tooltipProps={{ placement: 'bottom-end' }}
    />
  ),
}

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Demo
        {...args}
        fullWidth
        modalTitle="Actions"
        tooltipProps={{ placement: 'top-start' }}
      />
    </div>
  ),
}

export const MobileModal: Story = {
  render: (args) => <Demo {...args} modalTitle="Actions" />,
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
}
