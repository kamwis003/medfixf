export interface IUserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: TUserRole
  isNewAccount?: boolean
  avatarId?: string
}

export interface IProfileFormData {
  firstName: string
  lastName: string
  email: string
}

export interface IAccountNotification {
  type: TAccountNotificationType
  message: string
  description: string
}

export interface IUpdateUser {
  firstName?: string
  lastName?: string
}

export type TUserRole = 'USER' | 'ADMIN'
export type TAccountNotificationType = 'save' | 'verification' | 'passwordReset' | 'error'
