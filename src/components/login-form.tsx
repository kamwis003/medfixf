import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginFormSchema = z.object({
  email: z.email('validation.invalidEmail'),
  password: z.string().min(6, 'validation.passwordTooShort'),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { signInWithEmail } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  })

  const handleLogin = async (data: LoginFormValues) => {
    setAuthError(null)
    const { error } = await signInWithEmail({
      email: data.email,
      password: data.password,
    })

    if (error) {
      const getErrorMessage = (errorMessage: string, errorCode?: string) => {
        if (errorCode === 'email_not_confirmed') {
          return t('errors.emailNotConfirmed')
        }
        if (errorMessage.includes('Invalid login credentials')) {
          return t('errors.invalidLoginCredentials')
        }
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          return t('errors.networkError')
        }
        return t('errors.unknownError')
      }

      setAuthError(getErrorMessage(error.message, error.code))
    }
  }

  // const handleGoogleLogin = async () => {
  //   await signInWithOAuth('google')
  // }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('auth.welcomeBack')}</CardTitle>
          <CardDescription>{t('auth.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="grid gap-6">
              {/* TODO: Add OAuth login options */}
              {/* <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('auth.loginWithGoogle')}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t('auth.orContinueWith')}
                </span>
              </div> */}
              {authError && (
                <div className="rounded-md border border-red-500 bg-red-50 p-4 text-center text-sm text-red-700">
                  {authError}
                </div>
              )}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    {...register('email')}
                  />
                  {errors.email?.message && (
                    <p className="text-sm text-red-500">{t(errors.email.message)}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      title={t(showPassword ? 'auth.hidePassword' : 'auth.showPassword')}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.password?.message && (
                    <p className="text-sm text-red-500">{t(errors.password.message)}</p>
                  )}
                </div>
                <Button disabled={isSubmitting} type="submit" className="w-full">
                  {t('auth.login')}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="underline underline-offset-4">
                  {t('auth.signUp')}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        {t('auth.termsAndPrivacy').split('{{termsLink}}')[0]}
        <Link
          to={ROUTES.TERMS_OF_SERVICE}
          className="hover:text-primary underline underline-offset-4"
        >
          {t('auth.termsOfService')}
        </Link>
        {t('auth.termsAndPrivacy').split('{{termsLink}}')[1].split('{{privacyLink}}')[0]}
        <Link
          to={ROUTES.PRIVACY_POLICY}
          className="hover:text-primary underline underline-offset-4"
        >
          {t('auth.privacyPolicy')}
        </Link>
        {t('auth.termsAndPrivacy').split('{{privacyLink}}')[1]}
      </div>
    </div>
  )
}
