import type { ComponentProps, ReactNode } from 'react'
import classNames from 'classnames'
import { Typography } from '../Typography'
import styles from './EmptyState.module.scss'

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  icon?: ReactNode
  title: ReactNode
  text?: ReactNode
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6
  // the action: a Button
  children?: ReactNode
}

export const EmptyState = ({
  icon,
  title,
  text,
  headingLevel,
  children,
  className,
  ...rest
}: EmptyStateProps) => (
  <div className={classNames(styles.container, className)} {...rest}>
    {icon && (
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
    )}
    <div className={styles.text}>
      <Typography variant="h5" component={`h${headingLevel}`}>
        {title}
      </Typography>
      {text && (
        <Typography variant="t2" color="grey-500">
          {text}
        </Typography>
      )}
    </div>
    {children}
  </div>
)
