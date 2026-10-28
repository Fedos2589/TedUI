'use client'

import { KeyboardEvent, useId, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'

import { Typography } from '../Typography'
import { InputShell, InputShellProps } from '../Input/InputShell/InputShell'
import {
  inputMessageId,
  resolveInputMessage,
} from '../Input/InputShell/inputMessage'
import shellStyles from '../Input/InputShell/InputShell.module.scss'
import styles from './TagsInput.module.scss'

type ShellOnlyProps = Omit<
  InputShellProps,
  | 'children'
  | 'htmlFor'
  | 'multiline'
  | 'stack'
  | 'startIcon'
  | 'endIcon'
  | 'controlWrapperRef'
  | 'controlWrapperClassName'
  | 'onControlWrapperClick'
>

export interface TagsInputProps extends ShellOnlyProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  /** Once this many tags are added the text field is hidden. */
  maxTags?: number
  id?: string
}

/**
 * Free-text tag field: type and press Enter (or comma, or leave the field) to
 * turn the draft into a removable chip. Duplicates are dropped
 * case-insensitively, and Backspace on an empty field removes the last chip.
 */
export const TagsInput = ({
  value,
  onChange,
  placeholder,
  maxTags,
  size = 'medium',
  colorScheme = 'grey-blue',
  label,
  required,
  error,
  errorText,
  helperText,
  fullWidth,
  disabled,
  className,
  style,
  id: idProp,
}: TagsInputProps) => {
  const { t } = useTranslation('ui-kit')
  const reactId = useId()
  const id = idProp ?? reactId
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState('')

  const isFull = maxTags != null && value.length >= maxTags

  // Point the field at the helper line so the error text itself is read, not
  // just the fact that the field is invalid.
  const { content: message } = resolveInputMessage({
    error,
    errorText,
    helperText,
  })
  const describedBy = message != null ? inputMessageId(id) : undefined

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag || isFull) return
    if (!value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag])
    }
    setDraft('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    // The clicked button unmounts with its chip, so focus would fall to
    // <body> and a keyboard user would lose their place in the form.
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(draft)
      return
    }
    if (event.key === 'Backspace' && !draft && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  return (
    <InputShell
      size={size}
      colorScheme={colorScheme}
      label={label}
      required={required}
      error={error}
      errorText={errorText}
      helperText={helperText}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      style={style}
      htmlFor={id}
      stack
      onControlWrapperClick={() => inputRef.current?.focus()}
    >
      <div className={styles.items}>
        <span role="list" aria-live="polite" className={styles.tags}>
          {value.map((tag, index) => (
            <span role="listitem" key={tag} className={styles.tag}>
              <Typography variant="t3">{tag}</Typography>
              <button
                type="button"
                className={styles.remove}
                aria-label={`${t('common.button.remove')} ${tag}`}
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation()
                  removeTag(index)
                }}
              >
                <RiCloseLine size={16} aria-hidden />
              </button>
            </span>
          ))}
        </span>

        {!isFull && (
          <input
            id={id}
            ref={inputRef}
            className={cn(shellStyles.control, styles.field)}
            value={draft}
            placeholder={value.length > 0 ? undefined : placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(draft)}
          />
        )}
      </div>
    </InputShell>
  )
}
