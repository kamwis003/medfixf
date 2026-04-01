import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, generateColorByName } from '@/utils/avatar'

interface IUserAvatarProps {
  name: string
  avatarUrl?: string
  className?: string
}

export const UserAvatar: React.FC<IUserAvatarProps> = ({ name, avatarUrl, className }) => {
  const initials = getInitials(name)
  const backgroundColor = generateColorByName(name)

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="rounded-lg text-white" style={{ backgroundColor }}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
