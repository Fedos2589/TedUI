'use client'

import {
  CSSProperties,
  Ref,
  TextareaHTMLAttributes,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
} from 'react'
import cn from 'classnames'

import { InputShell, InputShellProps } from '../InputShell/InputShell'
import styles from '../InputShell/InputShell.module.scss'
import { inputMessageId, resolveInputMessage } from '../InputShell/inputMessage'

type ShellOnlyProps = Omit<
  InputShellProps,
  'children' | 'htmlFor' | 'multiline' | 'stack'
>

export type TextareaProps = ShellOnlyProps & {
  rows?: number
  minRows?: number
  maxRows?: number
  /**
   * Grows the field with its content, between `minRows` and `maxRows` (past
   * which it scrolls). Off by default — the field then keeps the `minRows`
   * height and scrolls inside it.
   */
  autoGrow?: boolean
  ref?: Ref<HTMLTextAreaElement>
} & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'size' | 'rows' | 'children'
  >

export function Textarea({
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
  rows,
  minRows,
  maxRows,
  autoGrow,
  onInput,
  ref,
  ...textareaProps
}: TextareaProps) {
  const reactId = useId()
  const id = idProp ?? reactId

  const innerRef = useRef<HTMLTextAreaElement | null>(null)

  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      innerRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref)
        (ref as { current: HTMLTextAreaElement | null }).current = el
    },
    [ref],
  )

  // Height is driven imperatively, not through the `style` prop: scrollHeight
  // only reports the content height once the element is collapsed first, and a
  // render pass can't observe its own layout. The CSS min-height / max-height
  // from minRows / maxRows still clamp the result.
  const resize = useCallback(() => {
    const el = innerRef.current
    if (!autoGrow || !el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [autoGrow])

  // Covers the controlled case (value changed by the parent); uncontrolled
  // typing doesn't re-render, so `onInput` resizes as well.
  useLayoutEffect(resize, [resize, textareaProps.value])

  const handleInput: NonNullable<TextareaProps['onInput']> = (e) => {
    resize()
    onInput?.(e)
  }

  // See `Input`: the control points at the helper line so the error text itself
  // is read, not just the fact that the field is invalid.
  const { content: message } = resolveInputMessage({
    error,
    errorText,
    helperText,
  })
  const describedBy =
    [
      textareaProps['aria-describedby'],
      message != null ? inputMessageId(id) : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  // minRows / maxRows forwarded as CSS custom properties; styles.module.scss
  // resolves them to min-height / max-height via `1lh + --input-py * 2`.
  const textareaStyle: CSSProperties = {
    ...(minRows != null && { ['--input-min-rows' as string]: minRows }),
    ...(maxRows != null && { ['--input-max-rows' as string]: maxRows }),
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
      disabled={textareaProps.disabled}
      multiline
      className={className}
      style={style}
      htmlFor={id}
      controlWrapperRef={controlWrapperRef}
      onControlWrapperClick={onControlWrapperClick}
    >
      <textarea
        {...textareaProps}
        ref={setRefs}
        id={id}
        rows={rows}
        onInput={handleInput}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        required={required}
        className={cn(styles.control, styles.textarea)}
        style={textareaStyle}
      />
    </InputShell>
  )
}
