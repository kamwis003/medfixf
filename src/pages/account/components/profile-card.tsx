import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { User, Mail, Save, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { DeleteAccountModal } from './delete-account-modal'
import type { IUserProfile, TUserRole } from '@/types/account'
import { getApiErrorMessage, getErrorMessage } from '@/utils/type-guards'

type TTranslationFunction = (key: string) => string
const createProfileFormSchema = (t: TTranslationFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, t('validation.profile.firstNameRequired'))
      .min(2, t('validation.profile.firstNameMinLength'))
      .max(50, t('validation.profile.firstNameMaxLength'))
      .regex(/^[a-zA-Z\s-']+$/, t('validation.profile.firstNameInvalidChars')),
    lastName: z
      .string()
      .min(1, t('validation.profile.lastNameRequired'))
      .min(2, t('validation.profile.lastNameMinLength'))
      .max(50, t('validation.profile.lastNameMaxLength'))
      .regex(/^[a-zA-Z\s-']+$/, t('validation.profile.lastNameInvalidChars')),
    email: z
      .email(t('validation.profile.emailInvalid'))
      .min(1, t('validation.profile.emailRequired')),
    title: z.string().max(100, t('validation.profile.titleMaxLength')).optional().or(z.literal('')),
    university: z
      .string()
      .max(200, t('validation.profile.universityMaxLength'))
      .optional()
      .or(z.literal('')),
  })

type TProfileFormData = z.infer<ReturnType<typeof createProfileFormSchema>>

interface IProfileTabProps {
  userProfile: IUserProfile
  onProfileUpdate: (updatedProfile: IUserProfile) => void
  onSaveNotification: () => void
  onVerificationSent: () => void
  onErrorNotification?: (message: string, description: string) => void
}

export const ProfileTab = ({
  userProfile,
  onProfileUpdate,
  onSaveNotification,
  onVerificationSent,
  onErrorNotification,
}: IProfileTabProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const {
    updateEmail,
    user,
    resendEmailVerification,
    userData,
    updateUserProfile,
    deleteUserAccount,
  } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const isOAuthUser = user?.app_metadata?.provider !== 'email'
  const hasPendingEmailChange = user?.new_email !== undefined && user?.email !== user?.new_email

  const profileFormSchema = createProfileFormSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<TProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
    },
    mode: 'onChange',
  })

  const handleSaveProfile = async (data: TProfileFormData) => {
    if (!isValid) return

    setIsSubmitting(true)
    try {
      // Update firstName/lastName via backend API
      const { data: profileData, error: metadataError } = await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      })

      if (metadataError) {
        console.error('Error updating profile metadata:', metadataError)

        // Extract translation key from API error if available
        const translationKey = getApiErrorMessage(metadataError)
        const errorMessage = translationKey
          ? t(translationKey)
          : getErrorMessage(metadataError, t('errors.unknownError'))

        if (onErrorNotification) {
          onErrorNotification(t('account.profile.error.title'), errorMessage)
        }
        return
      }

      // Update local state with the response data
      if (profileData) {
        onProfileUpdate(profileData)
      }

      // Handle email update separately (still uses Supabase)
      if (data.email !== userProfile.email && !isOAuthUser) {
        const { error: emailError } = await updateEmail(data.email)

        if (emailError) {
          console.error('Error updating email:', emailError)

          if (onErrorNotification) {
            onErrorNotification(t('account.profile.error.title'), emailError.message)
          }
          return
        }

        onVerificationSent()

        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: userProfile.email,
        })
      } else {
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: userProfile.email,
        })
      }

      // Show success notification only if firstName/lastName changed
      if (data.firstName !== userProfile.firstName || data.lastName !== userProfile.lastName) {
        onSaveNotification()
      }
    } catch (error) {
      console.error('Error updating profile:', error)

      // Extract translation key from API error if available
      const translationKey = getApiErrorMessage(error)
      const errorMessage = translationKey
        ? t(translationKey)
        : getErrorMessage(error, t('errors.unknownError'))

      if (onErrorNotification) {
        onErrorNotification(t('account.profile.error.title'), errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleLabel = (role: TUserRole) => {
    switch (role) {
      case 'USER':
        return t('account.profile.roles.user')
      case 'ADMIN':
        return t('account.profile.roles.admin')
      default:
        return t('account.profile.roles.user')
    }
  }

  const handleResendVerification = async () => {
    try {
      const { error } = await resendEmailVerification()
      if (error) {
        console.error('Error resending verification email:', error)
        return
      }

      onVerificationSent()
    } catch (error) {
      console.error('Error resending verification email:', error)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const { error } = await deleteUserAccount()
      if (error) {
        console.error('Error deleting account:', error)

        // Extract translation key from API error if available
        const translationKey = getApiErrorMessage(error)
        const errorMessage = translationKey
          ? t(translationKey)
          : getErrorMessage(error, t('errors.unknownError'))

        if (onErrorNotification) {
          onErrorNotification(t('account.deleteAccount.error.title'), errorMessage)
        }
        return
      }

      // No need to call signOut() - deleteUserAccount handles it internally
    } catch (error) {
      console.error('Error deleting account:', error)

      // Extract translation key from API error if available
      const translationKey = getApiErrorMessage(error)
      const errorMessage = translationKey
        ? t(translationKey)
        : getErrorMessage(error, t('errors.unknownError'))

      if (onErrorNotification) {
        onErrorNotification(t('account.deleteAccount.error.title'), errorMessage)
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              {t('account.profile.title')}
            </CardTitle>
            <CardDescription className="text-sm">
              {t('account.profile.description')}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {isDirty && (
              <Button
                size="sm"
                onClick={handleSubmit(handleSaveProfile)}
                disabled={!isValid || isSubmitting}
                className="text-xs sm:text-sm"
              >
                <Save className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                {isSubmitting ? t('account.profile.saving') : t('account.profile.save')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative mx-auto sm:mx-0 sm:shrink-0">
              <UserAvatar
                className="mx-auto h-20 w-20 rounded-3xl text-3xl sm:mx-0 sm:h-24 sm:w-24"
                name={`${userData?.firstName} ${userData?.lastName}`}
                avatarUrl={userData?.avatar}
              />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {userData?.role != 'USER' && (
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {getRoleLabel(userData?.role ?? 'ADMIN')}
                  </Badge>
                )}
                {isOAuthUser && (
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {t('account.profile.googleAccount')}
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-medium sm:text-lg">
                {userData?.firstName} {userData?.lastName}
              </h3>
              <p className="text-muted-foreground text-sm break-all">{userData?.email}</p>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('account.profile.firstName')}
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  disabled={isSubmitting}
                  className={`text-sm ${
                    errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t('account.profile.lastName')}
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  disabled={isSubmitting}
                  className={`text-sm ${
                    errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    {t('account.profile.email')}
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled={isSubmitting || isOAuthUser}
                    className={`text-sm pr-24 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {!isOAuthUser && hasPendingEmailChange && !isMobile && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        className="text-xs h-7 px-2"
                      >
                        {t('account.profile.resendVerification')}
                      </Button>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
                {isOAuthUser && (
                  <p className="text-muted-foreground text-xs">
                    {t('account.profile.emailOAuthNote')}
                  </p>
                )}

                {!isOAuthUser && hasPendingEmailChange && isMobile && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      className="text-xs sm:text-sm"
                    >
                      {t('account.profile.resendVerification')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex w-full">
          <div className="flex w-full flex-col gap-3 rounded-lg border border-red-800/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-4 w-4 shrink-0 text-red-400 sm:h-5 sm:w-5" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-red-400 sm:text-base">
                  {t('account.privacy.deleteAccount')}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {t('account.privacy.deleteAccountDesc')}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full text-xs sm:w-auto sm:text-sm"
            >
              {t('account.privacy.deleteAccount')}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteAccountModal
        isDeleteModalOpen={isDeleteModalOpen}
        onDeleteModalClose={() => setIsDeleteModalOpen(false)}
        onDeleteAccountConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </>
  )
}
