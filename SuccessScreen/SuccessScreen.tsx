'use client'

import { useId } from 'react'
import { Button, ButtonProps } from '../Button'
import { Typography } from '../Typography'
import styles from './SuccessScreen.module.scss'

interface SuccessScreenProps {
  image: string
  title: React.ReactNode
  description: React.ReactNode
  buttonProps: ButtonProps
}

const SuccessScreen = ({
  image,
  title,
  description,
  buttonProps,
}: SuccessScreenProps) => {
  const { children, ...restButtonProps } = buttonProps
  const titleId = useId()
  const descriptionId = useId()

  return (
    <div className={styles.container}>
      <img src={image} alt="" />
      <div className={styles.text}>
        <Typography id={titleId} variant="h3" align="center">
          {title}
        </Typography>
        <Typography
          id={descriptionId}
          variant="t2"
          color="greyscale.500"
          align="center"
        >
          {description}
        </Typography>
      </div>
      <Button
        fullWidth
        size="large"
        colorScheme="blue"
        aria-describedby={`${titleId} ${descriptionId}`}
        {...restButtonProps}
      >
        {children}
      </Button>
    </div>
  )
}

export { SuccessScreen }
export type { SuccessScreenProps }
