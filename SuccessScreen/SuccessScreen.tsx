'use client'

import { useId, type ReactNode } from 'react'
import { Button } from '../Button'
import { Typography } from '../Typography'
import styles from './SuccessScreen.module.scss'

interface SuccessScreenProps {
  image: string
  title: ReactNode
  description: ReactNode
  actionLabel: ReactNode
  onAction: () => void
}

const SuccessScreen = ({
  image,
  title,
  description,
  actionLabel,
  onAction,
}: SuccessScreenProps) => {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <div className={styles.container}>
      <img src={image} alt="" />
      <div className={styles.text}>
        <Typography id={titleId} variant="h3" className={styles.title}>
          {title}
        </Typography>
        <Typography
          id={descriptionId}
          variant="t2"
          color="grey-500"
          className={styles.description}
        >
          {description}
        </Typography>
      </div>
      <Button
        fullWidth
        size="large"
        colorScheme="blue"
        aria-describedby={`${titleId} ${descriptionId}`}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  )
}

export { SuccessScreen }
export type { SuccessScreenProps }
