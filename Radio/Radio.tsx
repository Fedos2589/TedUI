'use client'

import { Radio as BaseRadio } from '@base-ui/react/radio'
import { ComponentProps, useId } from 'react'
import cn from 'classnames'
import { RiQuestionLine } from '@remixicon/react'
import styles from './Radio.module.scss'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton/IconButton'
import { Tooltip } from '../Tooltip'

export interface RadioProps extends ComponentProps<typeof BaseRadio.Root> {
  label?: string
  hint?: string
  colorScheme?: 'blue' | 'green'
}

export const Radio = ({
  label,
  className,
  hint,
  disabled,
  colorScheme = 'blue',
  ...props
}: RadioProps) => {
  const labelId = useId()

  return (
    <label
      className={cn(
        styles.wrapper,
        { [styles.green]: colorScheme === 'green' },
        className,
      )}
    >
      <BaseRadio.Root
        className={styles.root}
        disabled={disabled}
        aria-labelledby={label ? labelId : undefined}
        {...props}
      />
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
