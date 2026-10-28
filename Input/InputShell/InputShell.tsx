'use client'

import { CSSProperties, MouseEventHandler, ReactNode, Ref } from 'react'
import cn from 'classnames'

import { Typography } from '../../Typography'
import { LiveRegion } from '../../LiveRegion/LiveRegion'

import styles from './InputShell.module.scss'
import {
  inputMessageId,
  inputMessageText,
  resolveInputMessage,
} from './inputMessage'

export type InputSize = 'small' | 'medium' | 'big'

export type InputColorScheme = 'grey' | 'grey-blue' | 'white' | 'beige'

export interface InputShellProps {
  size?: InputSize
  colorScheme?: InputColorScheme
  startIcon?: ReactNode
  endIcon?: ReactNode
  label?: ReactNode
  required?: boolean
  error?: boolean
  errorText?: ReactNode
  helperText?: ReactNode
  fullWidth?: boolean
  disabled?: boolean
  multiline?: boolean
  /**
   * Lays the control wrapper out as a full-width column with no built-in
   * padding, so the child can stack the control and a footer bar (each owning
   * its own padding) inside the same bordered/focusable box. Used by
   * `TagsInput`; `startIcon`/`endIcon` are not rendered in this mode.
   */
  stack?: boolean
  className?: string
  style?: CSSProperties
  htmlFor?: string
  controlWrapperRef?: Ref<HTMLDivElement>
  /**
   * Click handler attached to the visual control wrapper, not the inner
   * `<input>`. Use for read-only trigger inputs (e.g. mobile combobox) where
   * tapping the icon area also needs to register.
   */
  onControlWrapperClick?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
}

/**
 * Visual shell shared by `Input` and `Textarea`. Renders the outer container,
 * label, controlWrapper (background/border/padding by size+scheme), startIcon,
 * endIcon, and helper/error line. The actual `<input>` or `<textarea>` is
 * passed in via `children`.
 */
export function InputShell({
  size = 'medium',
  colorScheme = 'white',
  startIcon,
  endIcon,
  label,
  required,
  error,
  errorText,
  helperText,
  fullWidth = true,
  disabled,
  multiline,
  stack,
  className,
  style,
  htmlFor,
  controlWrapperRef,
  onControlWrapperClick,
  children,
}: InputShellProps) {
  const { isError, content: message } = resolveInputMessage({
    error,
    errorText,
    helperText,
  })
  // Only errors are announced. A hint that is simply present on the field would
  // otherwise be read out on every keystroke that re-renders it; it stays
  // reachable through `aria-describedby` instead.
  const announcement = isError ? inputMessageText(message) : undefined

  return (
    <div
      className={cn(
        styles.inputContainer,
        fullWidth && styles.fullWidth,
        className,
      )}
      style={style}
    >
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          <Typography variant="t3">
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </Typography>
        </label>
      )}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- a bigger mouse target for the input inside, which is the keyboard-reachable control */}
      <div
        ref={controlWrapperRef}
        onClick={onControlWrapperClick}
        className={cn(
          styles.controlWrapper,
          styles[`size-${size}`],
          styles[`scheme-${colorScheme}`],
          error && styles.error,
          disabled && styles.disabled,
          multiline && styles.multiline,
          stack && styles.stack,
          onControlWrapperClick && !disabled && styles.clickable,
        )}
      >
        {!stack && startIcon && (
          <span className={styles.startIcon}>{startIcon}</span>
        )}
        {children}
        {!stack && endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </div>

      {message != null && (
        <Typography
          variant="t3"
          id={htmlFor ? inputMessageId(htmlFor) : undefined}
          color={isError ? 'red.300' : 'greyscale.400'}
          className={styles.helperLine}
        >
          {message}
        </Typography>
      )}

      <LiveRegion message={announcement} />
    </div>
  )
}
