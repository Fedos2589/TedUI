import { ReactNode } from 'react'

export interface InputMessageArgs {
  error?: boolean
  errorText?: ReactNode
  helperText?: ReactNode
}

export interface InputMessage {
  /** The helper line is showing an error rather than a hint. */
  isError: boolean
  /** What the helper line renders; `null` when there is no line at all. */
  content: ReactNode
}

/**
 * Which of `errorText` / `helperText` the helper line under the control shows.
 * Shared so the shell (which renders the line) and `Input` / `Textarea` (which
 * decide whether to point `aria-describedby` at it) can never disagree.
 */
export const resolveInputMessage = ({
  error,
  errorText,
  helperText,
}: InputMessageArgs): InputMessage => {
  if (error && (errorText || helperText)) {
    return { isError: true, content: errorText || helperText }
  }

  if (!error && helperText) {
    return { isError: false, content: helperText }
  }

  return { isError: false, content: null }
}

export const inputMessageId = (controlId: string) => `${controlId}-message`

/**
 * A live region announces text, so only a plain string can be read out. A
 * `ReactNode` message still reaches the screen reader through
 * `aria-describedby` when the field is focused — it just isn't announced the
 * moment it appears.
 */
export const inputMessageText = (content: ReactNode): string | undefined =>
  typeof content === 'string' || typeof content === 'number'
    ? String(content)
    : undefined
