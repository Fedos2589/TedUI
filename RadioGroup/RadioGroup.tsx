'use client'

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { ComponentProps } from 'react'
import cn from 'classnames'
import styles from './RadioGroup.module.scss'

export interface RadioGroupProps extends ComponentProps<typeof BaseRadioGroup> {
  orientation?: 'vertical' | 'horizontal'
}

export const RadioGroup = ({
  orientation = 'vertical',
  className,
  ...props
}: RadioGroupProps) => {
  return (
    <BaseRadioGroup
      className={cn(
        styles.group,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        className,
      )}
      {...props}
    />
  )
}
