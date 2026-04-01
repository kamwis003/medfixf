import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Key } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface ISecurityTabProps {
  onNotification: () => void
}

export const SecurityTab = ({ onNotification }: ISecurityTabProps) => {
  const { t } = useTranslation()
  const { user, resetPasswordForEmail } = useAuth()

  const hasPendingEmailChange = user?.new_email !== undefined && user?.email !== user?.new_email
  const isOAuthUser = user?.app_metadata?.provider !== 'email'

  const handlePasswordReset = async () => {
    if (!user?.email) return
    if (hasPendingEmailChange) {
      return
    }

    try {
      const { error } = await resetPasswordForEmail(user.email)
      if (error) {
        console.error('Error sending password reset email:', error)
        return
      }
      onNotification()
    } catch (error) {
      console.error('Error sending password reset email:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          {t('account.security.title')}
        </CardTitle>
        <CardDescription className="text-sm">{t('account.security.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex items-center gap-3">
              <Key className="text-muted-foreground h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium sm:text-base">
                  {t('account.security.password')}
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {isOAuthUser
                    ? t('account.security.passwordOAuthNote')
                    : hasPendingEmailChange
                      ? t('account.security.passwordVerificationRequired')
                      : ''}
                </p>
              </div>
            </div>
            {!isOAuthUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasswordReset}
                disabled={hasPendingEmailChange}
                className="w-full text-xs sm:w-auto sm:text-sm"
              >
                {t('account.security.changePassword')}
              </Button>
            )}
          </div>

          {/* <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3'>
            <div className='flex items-center gap-3'>
              <Shield className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0' />
              <div className='min-w-0 flex-1'>
                <h4 className='font-medium text-sm sm:text-base'>
                  {t('account.security.twoFactor')}
                </h4>
                <p className='text-xs sm:text-sm text-muted-foreground'>
                  {t('account.security.twoFactorDescription')}
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='text-xs sm:text-sm w-full sm:w-auto'
            >
              {t('account.security.configure')}
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
