'use client'

import {
  Toaster,
  toast as hotToast,
  ToastBar,
  ToastPosition,
  Toast,
  resolveValue,
} from 'react-hot-toast'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiCloseLine,
  RiErrorWarningFill,
} from '@remixicon/react'
import { Typography } from '../Typography'
import { colorsUIKIT } from '../colors'
import styles from './Toast.module.scss'

// Spinner colors for the native loading icon (kept from the library) so it reads
// on the dark bubble. Secondary is a translucent white (not a palette token).
const LOADING_ICON_THEME = {
  primary: colorsUIKIT.greyscale.white,
  secondary: 'rgba(255,255,255,0.35)',
}

// react-hot-toast spreads unknown options onto the toast object, so we carry two
// custom flags: `status: 'warning'` (no native warning type) and `closeButton`
// (Figma "No icons" / "Left icon" states — icon present, no close button).
type ToastWithOptions = Toast & {
  closeButton?: boolean
  status?: 'warning'
}

const showCloseButton = (t: Toast): boolean =>
  t.type !== 'loading' && (t as ToastWithOptions).closeButton !== false

// Our design-system status icons (filled circle + white mark) and their colors,
// keyed by status. `warning` is our custom flag (no native warning type).
type StatusKey = 'success' | 'error' | 'warning'

const STATUS_ICONS: Record<StatusKey, typeof RiCheckboxCircleFill> = {
  success: RiCheckboxCircleFill,
  error: RiCloseCircleFill,
  warning: RiErrorWarningFill,
}
const STATUS_COLORS: Record<StatusKey, string> = {
  success: colorsUIKIT.green[300],
  error: colorsUIKIT.red[300],
  warning: colorsUIKIT.orange[200],
}

// Status icons get a pop-in animation. The loading spinner is the one case we
// keep from the library, so it stays animated natively; notification toasts
// (no status) have no icon.
const renderIcon = (t: Toast, nativeIcon: ReactNode): ReactNode => {
  if (t.type === 'loading') {
    return nativeIcon
  }
  const key: StatusKey | null =
    t.type === 'success' || t.type === 'error'
      ? t.type
      : (t as ToastWithOptions).status === 'warning'
        ? 'warning'
        : null
  if (!key) {
    return null // notification toast
  }
  const Icon = STATUS_ICONS[key]
  return (
    <span className={styles.iconEnter}>
      <Icon size={20} color={STATUS_COLORS[key]} aria-hidden />
    </span>
  )
}

// ─── Provider ────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  position?: ToastPosition
}

export const ToastProvider = ({
  position = 'top-center',
}: ToastProviderProps) => {
  const { t: translate } = useTranslation('ui-kit')

  return (
    <Toaster
      position={position}
      gutter={8}
      // Clear the notch/status bar in the PWA so top toasts aren't under the
      // island (0 in a browser). react-hot-toast's default top is 16px.
      containerStyle={{ top: 'calc(16px + var(--sa-top, 0px))' }}
      toastOptions={{
        duration: 2000,
        // Inline styles, not a CSS class: they beat goober's default white bubble.
        style: {
          background: colorsUIKIT.greyscale[600],
          color: '#fff',
          // Portal renders outside the MUI theme, so set the font explicitly.
          fontFamily: "'Montserrat', sans-serif",
          borderRadius: 16,
          padding: '12px 16px',
          // Hug the content; maxWidth still wraps long text.
          width: 'fit-content',
          maxWidth: 420,
          gap: 8,
          // Grey Shadow/L from the design system.
          boxShadow: '0 20px 20px 0 rgba(141, 152, 190, 0.1)',
        },
        loading: { iconTheme: LOADING_ICON_THEME },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon }) => (
            <>
              {renderIcon(t, icon)}
              {/* Raw message: the library's `message` arg is wrapped in a div
                  with margin that would add dead space around the text. */}
              <Typography variant="t3" color="white" {...t.ariaProps}>
                {resolveValue(t.message, t)}
              </Typography>
              {showCloseButton(t) && (
                <button
                  type="button"
                  onClick={() => hotToast.dismiss(t.id)}
                  className={styles.closeButton}
                  aria-label={translate('common.action.close')}
                >
                  <RiCloseLine
                    size={20}
                    color={colorsUIKIT.greyscale[400]}
                    aria-hidden
                  />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

// ─── Public API ──────────────────────────────────────────────────────────────
// `toast(msg)` = notification (no icon). `.success` / `.error` / `.loading` /
// `.promise` come from react-hot-toast; success/error icons are replaced by our
// design-system ones (loading keeps the native spinner). `.warning` is added
// here because the library has no native warning type.
export const toast = Object.assign(hotToast, {
  warning: (
    message: Parameters<typeof hotToast>[0],
    opts?: Parameters<typeof hotToast>[1],
  ) =>
    hotToast(message, { ...opts, status: 'warning' } as Parameters<
      typeof hotToast
    >[1]),
})
