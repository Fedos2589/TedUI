'use client'

import {
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
  useId,
} from 'react'

import { InputShell, InputShellProps } from './InputShell/InputShell'
import styles from './InputShell/InputShell.module.scss'
import { inputMessageId, resolveInputMessage } from './InputShell/inputMessage'

export type InputControlProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  className: string
  ref?: Ref<HTMLInputElement>
  'aria-invalid'?: boolean | undefined
  'aria-describedby'?: string | undefined
}

type ShellOnlyProps = Omit<
  InputShellProps,
  'children' | 'htmlFor' | 'multiline' | 'stack'
>

export type InputProps = ShellOnlyProps & {
  /**
   * Render a custom inner control instead of the default `<input>`. The shell
   * supplies an id, className, aria-* and required — caller spreads them onto
   * its rendered element (e.g. `<BaseCombobox.Input {...p} />`).
   */
  children?: (props: InputControlProps) => ReactNode
  ref?: Ref<HTMLInputElement>
  /**
   * Click handler attached to the visual control wrapper (the box around
   * the input + icons), not the `<input>` itself. Useful for read-only
   * trigger inputs where tapping the chevron/clear area should also count.
   */
  onControlWrapperClick?: MouseEventHandler<HTMLDivElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'>

export function Input({
  size,
  colorScheme,
  startIcon,
  endIcon,
  label,
  required,
  error,
  errorText,
  helperText,
  fullWidth,
  className,
  style,
  controlWrapperRef,
  onControlWrapperClick,
  id: idProp,
  ref,
  children,
  ...inputProps
}: InputProps) {
  const reactId = useId()
  const id = idProp ?? reactId

  // The helper line under the control carries the error text, so the control has
  // to point at it — `aria-invalid` alone announces "invalid" and never says why.
  const { content: message } = resolveInputMessage({
    error,
    errorText,
    helperText,
  })
  const describedBy =
    [
      inputProps['aria-describedby'],
      message != null ? inputMessageId(id) : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  const controlProps: InputControlProps = {
    ...inputProps,
    id,
    className: styles.control,
    'aria-invalid': error || undefined,
    'aria-describedby': describedBy,
    required,
    ref,
  }

  return (
    <InputShell
      size={size}
      colorScheme={colorScheme}
      startIcon={startIcon}
      endIcon={endIcon}
      label={label}
      required={required}
      error={error}
      errorText={errorText}
      helperText={helperText}
      fullWidth={fullWidth}
      disabled={inputProps.disabled}
      className={className}
      style={style}
      htmlFor={id}
      controlWrapperRef={controlWrapperRef}
      onControlWrapperClick={onControlWrapperClick}
    >
      {children ? children(controlProps) : <input {...controlProps} />}
    </InputShell>
  )
}
