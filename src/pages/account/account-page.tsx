import { useState, useEffect } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, AlertCircle, Info } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import type { IAccountNotification, IUserProfile } from '@/types/account'
import { ProfileTab } from './components/profile-card'
import { SecurityTab } from './components/security-card'

export const AccountPage = () => {
  useDocumentTitle('account.title')
  const { t } = useTranslation()
  const { user, userData } = useAuth()

  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null)
  const [notification, setNotification] = useState<IAccountNotification | null>(null)

  useEffect(() => {
    if (userData) {
      setUserProfile(userData)
    } else if (user) {
      const fullName = user.user_metadata?.full_name || ''
      const [firstName = '', lastName = ''] = fullName.split(' ')

      const fallbackProfile: IUserProfile = {
        id: user.id,
        email: user.email || '',
        firstName: firstName || t('user.defaultName'),
        lastName: lastName || '',
        avatar: user.user_metadata?.avatar_url || '',
        role: 'USER',
      }
      setUserProfile(fallbackProfile)
    }
  }, [user, userData, t])

  const handleProfileUpdate = (updatedProfile: IUserProfile) => {
    setUserProfile(updatedProfile)
  }

  const handleSaveNotification = () => {
    setNotification({
      type: 'save',
      message: t('account.profile.settingsSaved'),
      description: t('account.profile.settingsSavedDesc'),
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleVerificationSent = () => {
    setNotification({
      type: 'verification',
      message: t('account.profile.verificationSent'),
      description: t('account.profile.verificationNote'),
    })
    setTimeout(() => setNotification(null), 5000)
  }

  const handlePasswordResetNotification = () => {
    setNotification({
      type: 'passwordReset',
      message: t('account.security.passwordResetSent'),
      description: t('account.security.passwordResetNote'),
    })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleErrorNotification = (message: string, description: string) => {
    setNotification({
      type: 'error',
      message,
      description,
    })
    setTimeout(() => setNotification(null), 5000)
  }

  if (!userProfile) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-3 pt-0 sm:gap-8 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="space-y-6 sm:space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-3 pt-0 sm:gap-8 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t('userMenu.account')}</h1>
          </div>
        </div>
      </div>

      {notification && (
        <Alert>
          {notification.type === 'save' ? (
            <Check className="h-4 w-4" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertDescription>
            <div className="font-medium">{notification.message}</div>
            <div className="mt-1 text-xs sm:text-sm">{notification.description}</div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 sm:space-y-8">
        {userProfile && (
          <>
            <ProfileTab
              userProfile={userProfile}
              onProfileUpdate={handleProfileUpdate}
              onSaveNotification={handleSaveNotification}
              onVerificationSent={handleVerificationSent}
              onErrorNotification={handleErrorNotification}
            />
            <SecurityTab onNotification={handlePasswordResetNotification} />
          </>
        )}
      </div>
    </div>
  )
}
