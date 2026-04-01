import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/paths'

const forgotPasswordSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { resetPasswordForEmail } = useAuth()
  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    await resetPasswordForEmail(data.email)
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">{t('updatePassword.title')}</h1>
          <p className="text-muted-foreground mb-4">{t('updatePassword.description')}</p>
          <Button asChild>
            <Link to={ROUTES.LOGIN}>{t('auth.returnToLogin')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t('forgotPassword.title')}</CardTitle>
          <CardDescription>{t('forgotPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleForgotPassword)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('form.emailPlaceholder')}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm">{t(errors.email.message)}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {t('forgotPassword.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        <Link to={ROUTES.LOGIN} className="underline underline-offset-4">
          {t('auth.returnToLogin')}
        </Link>
      </div>
    </div>
  )
}
