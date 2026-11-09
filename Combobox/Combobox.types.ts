import type {
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react'

export interface ComboboxProps<Value = string> {
  options: Value[]
  value?: Value | null
  inputValue?: string
  onValueChange?: (value: Value | null) => void
  onInputValueChange?: (value: string) => void
  itemToStringLabel?: (item: Value) => string
  isItemEqualToValue?: (a: Value, b: Value) => boolean
  filter?:
    | ((
        itemValue: Value,
        query: string,
        itemToString?: (itemValue: Value) => string,
      ) => boolean)
    | null
  label?: ReactNode
  required?: boolean
  placeholder?: string
  emptyValue?: ReactNode
  // Shown in the empty dropdown while the search hasn't started (input is
  // blank). Distinct from `emptyValue`, which means "typed, but no matches".
  // Defaults to a localized "Start typing to see suggestions" hint.
  emptyInputValue?: ReactNode
  size?: 'small' | 'medium' | 'big'
  colorScheme?: 'grey' | 'grey-blue' | 'white' | 'beige'
  error?: boolean
  errorText?: ReactNode
  helperText?: ReactNode
  disabled?: boolean
  readOnly?: boolean
  /**
   * Pass a handler to show the inline clear (×) button. The handler is
   * responsible for resetting both the surrounding store and any controlled
   * `inputValue`. Without it the trigger always renders a chevron.
   */
  onClear?: () => void
  className?: string
  /** Extra class on the desktop dropdown popup — e.g. to widen it past the anchor width. */
  popupClassName?: string
  renderItem?: (item: Value) => ReactNode
  /**
   * Stable React key for each option. Defaults to the array index, but list
   * items whose labels can collide (e.g. US cities sharing a name across
   * states) must pass a unique identity here so React reconciles correctly and
   * stale options can't survive a data replacement.
   */
  getItemKey?: (item: Value) => string | number
  startIcon?: ReactNode
  /**
   * Native attributes forwarded to the inner `<input>`. Needed when the
   * combobox is a real text field the user types into (e.g. an email field
   * that needs `type="email"` for the mobile keyboard and `autoFocus`).
   * Desktop rendering only — the mobile trigger is read-only.
   */
  inputProps?: Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'inputMode'
    | 'autoComplete'
    | 'autoFocus'
    | 'name'
    | 'onBlur'
    | 'onFocus'
  >
  /**
   * Open the popup when the input receives focus, not only on click. base-ui
   * opens on `mousedown`, so keyboard (Tab) and programmatic focus leave the
   * list closed. Only opens when there is at least one option to show.
   * Desktop rendering only.
   */
  openOnFocus?: boolean
  /**
   * Drop the chevron button at the end of the field. For a combobox used as a
   * plain text input whose list is a typing aid rather than the only way in,
   * the chevron reads as "this is a select" and invites a tap that does nothing
   * useful. Desktop rendering only; the clear button, when enabled, still shows.
   */
  hideTrigger?: boolean
  mobileLabel?: string
  searchPlaceholder?: string
  /**
   * Use this element as the control the popup hangs off instead of the built-in
   * Input — for a combobox embedded in another control (e.g. the country prefix
   * inside a phone field). Base UI merges its trigger props into the element,
   * so pass a single interactive node (a `Button`). The search field then moves
   * inside the popup on desktop; mobile already searches inside the modal.
   * Give it an `aria-label`: it gets `role="combobox"`, which takes no name
   * from its text.
   */
  trigger?: ReactElement
  /**
   * Element the popup is positioned against and sized to, overriding the
   * default (the field, or the `trigger` when there is one). Pass the enclosing
   * control when the trigger is only a part of it — a country prefix inside a
   * phone field — so the popup spans the whole field instead of the button.
   */
  anchor?: Element | RefObject<Element | null> | null
  /**
   * Force mobile (Modal) rendering regardless of viewport, or force desktop
   * rendering with `false`. Pass `false` for fields the user must type into
   * freely (the mobile variant is a read-only trigger + search modal, which
   * breaks direct typing); leave unset to let the viewport decide.
   */
  forceMobile?: boolean
}
