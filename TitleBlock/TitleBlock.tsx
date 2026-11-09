import { ReactNode } from 'react'
import cn from 'classnames'
import { Typography, TypographyVariant } from '../Typography'
import styles from './TitleBlock.module.scss'

export type TitleBlockSize = 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs'

export interface TitleBlockProps {
  title: ReactNode
  subtitle?: ReactNode
  size?: TitleBlockSize
  align?: 'left' | 'center' | 'right'
  className?: string
}

type SizeConfig = {
  title: TypographyVariant
  subtitle: TypographyVariant
}

const SIZE_CONFIG: Record<TitleBlockSize, SizeConfig> = {
  xxl: { title: 'h1', subtitle: 't2' },
  xl: { title: 'h2', subtitle: 't2' },
  l: { title: 'h3', subtitle: 't2' },
  m: { title: 'h4', subtitle: 't2' },
  s: { title: 'h5', subtitle: 't3' },
  xs: { title: 'h6', subtitle: 't4' },
}

export const TitleBlock = ({
  title,
  subtitle,
  size = 'l',
  align = 'center',
  className,
}: TitleBlockProps) => {
  const config = SIZE_CONFIG[size]
  return (
    <div className={cn(styles.container, styles[`size_${size}`], className)}>
      <Typography
        variant={config.title}
        className={cn(styles.line, styles[`align_${align}`])}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant={config.subtitle}
          color="grey-500"
          className={cn(styles.line, styles[`align_${align}`])}
        >
          {subtitle}
        </Typography>
      ) : null}
    </div>
  )
}
