import { CSSProperties, PropsWithChildren } from 'react'

interface StackProps {
  direction?: CSSProperties['flexDirection']
  spacing?: number
  alignItems?: CSSProperties['alignItems']
  justifyContent?: CSSProperties['justifyContent']
  width?: CSSProperties['width']
  style?: CSSProperties
}

/**
 * Storybook-only flex layout helper — a MUI-free replacement for `Stack`.
 * `spacing` is in 8px units to match the MUI `Stack` API the stories used.
 */
export const Stack = ({
  direction = 'column',
  spacing = 0,
  alignItems,
  justifyContent,
  width,
  style,
  children,
}: PropsWithChildren<StackProps>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: spacing * 8,
      alignItems,
      justifyContent,
      width,
      ...style,
    }}
  >
    {children}
  </div>
)
