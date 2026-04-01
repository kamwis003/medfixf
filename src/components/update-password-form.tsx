import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useLocation, Link } from 'react-router-dom'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/configuration/supabase'
import { ROUTES } from '@/routes/paths'

interface IRecoveryData {
  email: string
  code: string
}

const schema = z
  .object({
    password: z.string().min(6, 'validation.passwordTooShort'),
    confirmPassword: z.string().min(6, 'validation.passwordTooShort'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordsDoNotMatch',
    path: ['confirmPassword'],
  })

type TFormData = z.infer<typeof schema>

function parseRecoveryParams(searchParams: URLSearchParams): IRecoveryData | null {
  const email = searchParams.get('email')
  const code = searchParams.get('code') || searchParams.get('token_hash')

  if (!email || !code) return null

  return { email, code }
}

async function verifyRecoveryCode(email: string, token: string): Promise<boolean> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  })

  return !error
}

function UpdatePasswordErrorView({
  isResending,
  onResend,
}: {
  isResending: boolean
  onResend: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">{t('updatePassword.errorTitle')}</h1>
        <p className="text-muted-foreground">{t('updatePassword.errorDescription')}</p>
        <div className="flex gap-3">
          <Button onClick={onResend} disabled={isResending}>
            {isResending ? t('updatePassword.resending') : t('updatePassword.resend')}
          </Button>
          <Button variant="outline" asChild>
            <Link to={ROUTES.LOGIN}>{t('auth.returnToLogin')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const UpdatePasswordForm = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { updatePassword, signOut, resetPasswordForEmail } = useAuth()

  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isResending, setIsResending] = React.useState(false)
  const [hasResent, setHasResent] = React.useState(false)

  const recoveryData = React.useMemo(() => {
    return parseRecoveryParams(new URLSearchParams(location.search))
  }, [location.search])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const handleResend = React.useCallback(async () => {
    if (!recoveryData) return

    setIsResending(true)
    setHasResent(false)

    try {
      await resetPasswordForEmail(recoveryData.email)
      setHasResent(true)
      setServerError(null)
    } catch {
      setServerError(t('updatePassword.errorResendFailed'))
    } finally {
      setIsResending(false)
    }
  }, [recoveryData, resetPasswordForEmail, t])

  const onSubmit = React.useCallback(
    async (data: TFormData) => {
      if (!recoveryData) {
        setServerError(t('updatePassword.error'))
        return
      }

      setServerError(null)

      const canProceed = await verifyRecoveryCode(recoveryData.email, recoveryData.code)
      if (!canProceed) {
        setServerError(t('updatePassword.error'))
        return
      }

      const { error: updateError } = await updatePassword(data.password)
      if (updateError) {
        setServerError(t('updatePassword.error'))
        return
      }

      await signOut()
      window.location.replace(ROUTES.LOGIN)
    },
    [recoveryData, updatePassword, signOut, t]
  )

  if (serverError) {
    return (
      <div className="flex flex-col items-center">
        <UpdatePasswordErrorView isResending={isResending} onResend={handleResend} />
        {hasResent && (
          <p className="text-green-600 text-sm mt-2 text-center">
            {t('updatePassword.resendSuccess')}
          </p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t('updatePassword.newPassword')}</Label>
            <PasswordInput
              id="password"
              showPasswordLabel={t('auth.showPassword')}
              hidePasswordLabel={t('auth.hidePassword')}
              {...register('password')}
            />
            {errors.password?.message && (
              <p className="text-red-500 text-sm">{t(errors.password.message)}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">{t('updatePassword.confirmPassword')}</Label>
            <PasswordInput
              id="confirmPassword"
              showPasswordLabel={t('auth.showPassword')}
              hidePasswordLabel={t('auth.hidePassword')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-500 text-sm">{t(errors.confirmPassword.message)}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('common.submitting') : t('updatePassword.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
