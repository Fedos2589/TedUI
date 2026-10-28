'use client'

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { ComponentProps, useId } from 'react'
import cn from 'classnames'
import { RiCheckLine, RiQuestionLine } from '@remixicon/react'
import styles from './styles.module.scss'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton/IconButton'
import { Tooltip } from '../Tooltip'

export interface CheckboxProps extends ComponentProps<
  typeof BaseCheckbox.Root
> {
  label?: string
  error?: boolean
  hint?: string
  colorScheme?: 'blue' | 'neutral'
}

export const Checkbox = ({
  label,
  className,
  error = false,
  hint,
  disabled,
  colorScheme = 'blue',
  ...props
}: CheckboxProps) => {
  const labelId = useId()

  return (
    <label
      className={cn(
        styles.wrapper,
        {
          [styles.error]: error,
          [styles.disabled]: disabled,
          [styles.neutral]: colorScheme === 'neutral',
        },
        className,
      )}
    >
      <BaseCheckbox.Root
        className={styles.root}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-labelledby={label ? labelId : undefined}
        {...props}
      >
        <BaseCheckbox.Indicator className={styles.indicator} keepMounted>
          <RiCheckLine size={16} className={styles.icon} aria-hidden />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {(label || hint) && (
        <span className={styles.textGroup}>
          {label && (
            <Typography variant="t2" id={labelId} className={styles.label}>
              {label}
            </Typography>
          )}
          {hint && (
            <Tooltip title={hint} placement="top">
              <IconButton
                size="small"
                colorScheme="whiteBlue"
                className={styles.hint}
                aria-label={hint}
              >
                <RiQuestionLine size={16} aria-hidden />
              </IconButton>
            </Tooltip>
          )}
        </span>
      )}
    </label>
  )
}
