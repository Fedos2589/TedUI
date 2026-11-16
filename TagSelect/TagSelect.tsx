import { ReactNode } from 'react'
import cn from 'classnames'
import { Tag, TagColorScheme, TagSize } from '../Tag/Tag'
import styles from './TagSelect.module.scss'

export interface TagSelectOption<V extends string | number = number> {
  value: V
  label: ReactNode
  disabled?: boolean
}

export interface TagSelectProps<V extends string | number = number> {
  options: TagSelectOption<V>[]
  value: V[]
  onChange: (value: V[]) => void
  /** Allow selecting several options at once. Single-select otherwise. */
  multiple?: boolean
  colorScheme?: TagColorScheme
  size?: TagSize
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const TagSelect = <V extends string | number = number>({
  options,
  value,
  onChange,
  multiple = true,
  colorScheme = 'blue',
  size = 'medium',
  className,
  ...props
}: TagSelectProps<V>) => {
  const toggle = (optionValue: V) => {
    if (!multiple) {
      onChange(value.includes(optionValue) ? [] : [optionValue])
      return
    }
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <div role="group" className={cn(styles.root, className)} {...props}>
      {options.map((option) => {
        const isActive = value.includes(option.value)
        return (
          <Tag
            key={String(option.value)}
            label={option.label}
            size={size}
            colorScheme={colorScheme}
            isActive={isActive}
            aria-pressed={isActive}
            aria-disabled={option.disabled || undefined}
            // A disabled option has no handler, so Tag renders it as a div:
            // keep it a named, unfocusable button. Enabled ones are real buttons.
            {...(option.disabled && { role: 'button', tabIndex: -1 })}
            className={cn({ [styles.disabled]: option.disabled })}
            onClick={option.disabled ? undefined : () => toggle(option.value)}
          />
        )
      })}
    </div>
  )
}
