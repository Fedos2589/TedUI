'use client'

import { useState } from 'react'
import cn from 'classnames'
import styles from './Avatar.module.scss'
import UserIcon from '../assets/avatar/avatar_user.svg'
import UploadIcon from '../assets/avatar/avatar_upload.svg'
import { useTranslation } from 'react-i18next'
import { Typography, TypographyVariant } from '../Typography'
import { initialsVariantBySize, SIZE_CLASS_MAP } from './constants'

export type AvatarSize =
  '100' | '72' | '60' | '52' | '40' | '32' | '24' | '20' | '16'

export type AvatarProps = {
  size?: AvatarSize
  src?: string
  initials?: string
  alt?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const Avatar = ({
  size = '40',
  src,
  initials,
  alt,
  className,
  onClick,
}: AvatarProps) => {
  const { t } = useTranslation('ui-kit')
  const [imageError, setImageError] = useState(false)

  const showsInitials = (!src || imageError) && !!initials && !onClick

  const renderContent = () => {
    if (!!onClick && !src) {
      return (
        <>
          <UploadIcon className={styles.icon} aria-hidden />
          {Number(size) > 52 ? (
            <Typography variant="t5" color="blue.300">
              {t('page.cropAvatarModal.upload')}
            </Typography>
          ) : null}
        </>
      )
    }

    if (src && !imageError) {
      return (
        <img
          className={styles.image}
          src={src}
          alt={alt ?? (initials || '')}
          onError={() => setImageError(true)}
        />
      )
    }

    if (initials) {
      return (
        <Typography
          variant={initialsVariantBySize[size] as TypographyVariant}
          color="greyscale.200"
          aria-hidden={alt !== undefined || undefined}
        >
          {initials}
        </Typography>
      )
    }

    return <UserIcon className={styles.userIcon} aria-hidden />
  }

  const rootClassName = cn(
    styles.avatar,
    SIZE_CLASS_MAP[size],
    styles.user,
    {
      [styles.button]: !!onClick,
      [styles.input]: !!onClick,
      [styles.initials]: showsInitials,
    },
    className,
  )

  if (onClick) {
    const hasVisibleText = !src && Number(size) > 52
    return (
      <button
        type="button"
        className={rootClassName}
        aria-label={
          hasVisibleText ? undefined : t('page.cropAvatarModal.upload')
        }
        onClick={onClick}
      >
        {renderContent()}
      </button>
    )
  }

  const showsImage = !!src && !imageError
  const namesRoot = !!alt && !showsImage

  return (
    <div
      className={rootClassName}
      role={namesRoot ? 'img' : undefined}
      aria-label={namesRoot ? alt : undefined}
    >
      {renderContent()}
    </div>
  )
}
