'use client'

import classNames from 'classnames'
import type { ComponentProps, CSSProperties } from 'react'

import { useKeyboardInset } from '../hooks/useKeyboardInset'
import styles from './ActionBar.module.scss'

export type ActionBarProps = ComponentProps<'div'>

// The main action(s) of a form or a step. On mobile it is pinned to the bottom
// of the screen, above the home indicator, and rises above the on-screen
// keyboard (useKeyboardInset), so the action stays reachable while typing.
// On desktop it sits in the flow. Put it inside the <form>, after the fields.
export const ActionBar = ({
  className,
  style,
  children,
  ...props
}: ActionBarProps) => {
  const keyboardInset = useKeyboardInset()

  return (
    <div
      {...props}
      className={classNames(styles.bar, className)}
      // Geometry only: how far the keyboard reaches up.
      style={
        { ...style, '--keyboard-inset': `${keyboardInset}px` } as CSSProperties
      }
      data-keyboard-open={keyboardInset > 0 || undefined}
    >
      {children}
    </div>
  )
}
