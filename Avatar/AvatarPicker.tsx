import { ChangeEventHandler, useRef } from 'react'
import { Avatar, AvatarSize } from './Avatar'

interface AvatarPickerProps {
  avatar?: string
  size?: AvatarSize
  onChange: ChangeEventHandler<HTMLInputElement>
}

export const AvatarPicker = ({
  avatar,
  size = '100',
  onChange,
}: AvatarPickerProps) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  return (
    <>
      <Avatar
        size={size}
        src={avatar}
        onClick={() => fileRef.current?.click()}
      />
      <input
        ref={fileRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        onChange={handleChange}
        hidden
      />
    </>
  )
}
