'use client'

import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import { LiveRegion } from '../LiveRegion/LiveRegion'
import styles from './CodeField.module.scss'

export type CodeFieldSize = 'small' | 'medium' | 'large'

export interface CodeFieldProps {
  /** Left-packed: `'12'` fills the first two boxes and leaves the rest empty. */
  value: string
  onChange: (value: string) => void
  length?: number
  /**
   * Names the group for assistive tech. Not rendered — these screens carry a
   * visible heading already — but without it a screen reader announces six
   * anonymous boxes.
   */
  label: string
  error?: boolean
  errorText?: string
  disabled?: boolean
  autoFocus?: boolean
  /**
   * Returns the caret to the first box whenever this changes. Needed for actions
   * that leave focus elsewhere: pressing "Resend" moves it to that button, which
   * then disables itself for the cooldown.
   */
  focusNonce?: number | string
  size?: CodeFieldSize
  /**
   * Spreads the boxes across the full width of the field instead of giving them
   * the size's fixed width. For screens that lay the field out in a column of a
   * known width; the size then only decides the box height and font.
   */
  fluid?: boolean
  className?: string
}

/**
 * Segmented one-time-code input: one box per character, fully controlled.
 *
 * Controlled on purpose. Uncontrolled implementations keep the characters in the
 * DOM, so the owner cannot clear the field after a rejected code without an
 * imperative handle — which is how a wrong code ends up stuck on screen. Here
 * clearing is `value=''` and the focus returns to the first box by itself.
 *
 * `errorText` is both shown under the boxes and pushed to a live region, so a
 * rejected code is announced and not only coloured.
 *
 * Keyboard model follows the ARIA composite pattern: the group is a single Tab
 * stop (roving `tabindex`), so Tab moves on to whatever follows the field
 * instead of walking six boxes. Inside, the arrows, Home and End move the caret,
 * which is what makes fixing one wrong digit possible.
 *
 * The value stays left-packed — a string with no holes — so the caret cannot go
 * past the first empty box. Editing a box rewrites that position; Backspace
 * deletes and closes the gap, the way a normal text field behaves.
 */
export const CodeField = ({
  value,
  onChange,
  length = 6,
  label,
  error,
  errorText,
  disabled,
  autoFocus,
  focusNonce,
  size = 'large',
  fluid,
  className,
}: CodeFieldProps) => {
  const { t } = useTranslation('ui-kit')
  const messageId = useId()
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const previousLength = useRef(value.length)
  const [caretIndex, setCaretIndex] = useState(0)

  const characters = Array.from({ length }, (_, i) => value[i] ?? '')
  // The caret may sit on any entered character or on the first empty box, never
  // beyond it — that is what keeps the value free of holes.
  const lastReachable = Math.min(value.length, length - 1)
  const activeIndex = Math.min(caretIndex, lastReachable)

  const focusBox = (index: number) => {
    if (disabled) {
      return
    }
    const target = Math.min(Math.max(index, 0), length - 1)
    setCaretIndex(target)
    const box = inputsRef.current[target]
    box?.focus()
    box?.select()
  }

  const hasFocusInside = () =>
    inputsRef.current.some((box) => box === document.activeElement)

  useEffect(() => {
    if (autoFocus) {
      focusBox(0)
    }
    // Mount only — every later focus move is driven by editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the DOM focus on whichever box the caret is on. Guarded on the field
  // already holding focus so the component never steals it from the page.
  useEffect(() => {
    if (!hasFocusInside()) {
      return
    }
    const box = inputsRef.current[activeIndex]
    if (box && box !== document.activeElement) {
      box.focus()
      box.select()
    }
  }, [value, activeIndex])

  // The owner clearing the field (rejected code, fresh code sent) has to get the
  // caret back to where typing starts. Otherwise the boxes empty out while focus
  // sits on the last one — or nowhere at all, because the inputs were disabled
  // while the request was in flight and a disabled input drops focus.
  useEffect(() => {
    if (value.length === 0 && previousLength.current > 0) {
      focusBox(0)
    }
    previousLength.current = value.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled])

  // Asked for explicitly by the owner (see `focusNonce`). Separate from the
  // effect above because the field is usually already empty at that point, so
  // there is no length change to react to.
  useEffect(() => {
    if (focusNonce == null) {
      return
    }
    focusBox(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce])

  const emitValue = (next: string) => {
    onChange(next.replace(/\D/g, '').slice(0, length))
  }

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const typed = event.target.value.replace(/\D/g, '')
      if (!typed) {
        return
      }

      // Several characters at once means the whole code arrived in one box — an
      // OS `one-time-code` autofill — so it replaces the value outright. This is
      // why the boxes carry no `maxLength`: capping them at one character would
      // truncate that autofill to a single digit.
      if (typed.length > 1) {
        emitValue(typed)
        focusBox(Math.min(typed.length, length - 1))
        return
      }

      // Writes at the caret rather than appending, so a wrong digit can be
      // corrected in place. At the first empty box this is an append.
      emitValue(value.slice(0, index) + typed + value.slice(index + 1))
      focusBox(index + 1)
    }

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      // Tab is deliberately not handled: with a roving `tabindex` only the caret
      // box is in the tab order, so the browser takes Tab out of the group by
      // itself.
      switch (event.key) {
        case 'Backspace': {
          event.preventDefault()
          if (characters[index]) {
            // Delete this character and close the gap, as a text field would.
            emitValue(value.slice(0, index) + value.slice(index + 1))
          } else if (index > 0) {
            emitValue(value.slice(0, index - 1) + value.slice(index))
            focusBox(index - 1)
          }
          return
        }
        case 'Delete': {
          event.preventDefault()
          if (characters[index]) {
            emitValue(value.slice(0, index) + value.slice(index + 1))
          }
          return
        }
        case 'ArrowLeft': {
          event.preventDefault()
          focusBox(index - 1)
          return
        }
        case 'ArrowRight': {
          event.preventDefault()
          // Bounded by the entered characters, not by the grid: the caret must
          // not land past the first empty box, or it would sit on one box while
          // typing filled another.
          focusBox(Math.min(index + 1, lastReachable))
          return
        }
        case 'Home': {
          event.preventDefault()
          focusBox(0)
          return
        }
        case 'End': {
          event.preventDefault()
          focusBox(lastReachable)
          return
        }
        default:
          return
      }
    }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) {
      return
    }
    event.preventDefault()
    emitValue(pasted)
    focusBox(Math.min(pasted.length, length - 1))
  }

  // Clicking picks that box up to the first empty one; a click past the entered
  // characters lands on the entry point rather than leaving a hole behind.
  const handleMouseDown = (index: number) => (event: MouseEvent) => {
    if (disabled) {
      return
    }
    event.preventDefault()
    focusBox(Math.min(index, lastReachable))
  }

  return (
    <div className={cn(styles.root, className)}>
      <div
        role="group"
        aria-label={label}
        className={cn(styles.boxes, styles[size], fluid && styles.fluid)}
      >
        {characters.map((char, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
            className={cn(styles.box, error && styles.boxError)}
            // `tel` gives the numeric keypad on iOS without the spinner buttons
            // and value clamping that `number` brings along.
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            // Only the first box carries the token: the OS fills the whole code
            // through it and `handleChange` spreads it across the rest.
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={t('codeField.digit', {
              current: index + 1,
              total: length,
            })}
            aria-invalid={error || undefined}
            aria-describedby={error && errorText ? messageId : undefined}
            disabled={disabled}
            value={char}
            // Roving tabindex: only the caret box is reachable with Tab, so Tab
            // leaves the group instead of stepping through every box.
            tabIndex={index === activeIndex ? 0 : -1}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste}
            onMouseDown={handleMouseDown(index)}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>

      <LiveRegion message={error ? errorText : undefined} />
    </div>
  )
}
