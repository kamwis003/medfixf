import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

const registerFormSchema = z
  .object({
    firstName: z.string().min(1, 'validation.required'),
    lastName: z.string().min(1, 'validation.required'),
    email: z.string().email('validation.invalidEmail'),
    password: z
      .string()
      .min(8, 'validation.passwordMinLength')
      .regex(/[a-z]/, 'validation.passwordRequiresLowercase')
      .regex(/[A-Z]/, 'validation.passwordRequiresUppercase')
      .regex(/[0-9]/, 'validation.passwordRequiresDigit')
      .regex(/[^a-zA-Z0-9]/, 'validation.passwordRequiresSymbol'),
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validation.passwordsDoNotMatch',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerFormSchema>

export const RegisterForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  })

  const password = watch('password') || ''

  const passwordRequirements = useMemo(
    () => [
      {
        key: 'minLength',
        label: t('validation.passwordRequirements.minLength'),
        test: (pwd: string) => pwd.length >= 8,
      },
      {
        key: 'lowercase',
        label: t('validation.passwordRequirements.lowercase'),
        test: (pwd: string) => /[a-z]/.test(pwd),
      },
      {
        key: 'uppercase',
        label: t('validation.passwordRequirements.uppercase'),
        test: (pwd: string) => /[A-Z]/.test(pwd),
      },
      {
        key: 'digit',
        label: t('validation.passwordRequirements.digit'),
        test: (pwd: string) => /[0-9]/.test(pwd),
      },
      {
        key: 'symbol',
        label: t('validation.passwordRequirements.symbol'),
        test: (pwd: string) => /[^a-zA-Z0-9]/.test(pwd),
      },
    ],
    [t]
  )

  const handleRegister = async (data: RegisterFormValues) => {
    setAuthError(null)
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })

    if (error) {
      const getErrorMessage = (errorMessage: string) => {
        if (errorMessage.includes('User already registered')) {
          return t('errors.userAlreadyRegistered')
        }
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          return t('errors.networkError')
        }
        return t('errors.unknownError')
      }

      setAuthError(getErrorMessage(error.message))
    } else {
      setRegistrationSuccess(true)
    }
  }

  // const handleGoogleSignUp = async () => {
  //   await signInWithOAuth('google')
  // }

  if (registrationSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">{t('auth.registrationSuccessTitle')}</h1>
          <p className="text-muted-foreground mb-4">{t('auth.registrationSuccessMessage')}</p>
          <Button asChild>
            <Link to="/login">{t('auth.goToLogin')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-xl">{t('auth.createAccount')}</CardTitle>
          <CardDescription>{t('auth.createAccountDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="grid gap-6">
              {/* TODO: Add OAuth login options */}
              {/* <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {t('auth.signUpWithGoogle')}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t('auth.orContinueWithEmail')}
                </span>
              </div> */}
              {authError && (
                <div className="rounded-md border border-red-500 bg-red-50 p-4 text-center text-sm text-red-700">
                  {authError}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t('auth.firstNamePlaceholder')}
                    {...register('firstName')}
                  />
                  {errors.firstName?.message && (
                    <p className="text-sm text-red-500">{t(errors.firstName.message)}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t('auth.lastNamePlaceholder')}
                    {...register('lastName')}
                  />
                  {errors.lastName?.message && (
                    <p className="text-sm text-red-500">{t(errors.lastName.message)}</p>
                  )}
                </div>
              </div>
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
                <Label htmlFor="password">{t('auth.password')}</Label>
                <PasswordInput
                  id="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  showPasswordLabel={t('auth.showPassword')}
                  hidePasswordLabel={t('auth.hidePassword')}
                  {...register('password')}
                />
                {/* Password Requirements Hints */}
                <div className="rounded-md border bg-muted/50 p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
                  <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">
                    {t('validation.passwordRequirements.title')}
                  </p>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {passwordRequirements.map(requirement => {
                      const isMet = requirement.test(password)
                      return (
                        <li
                          key={requirement.key}
                          className={cn(
                            'flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs transition-colors leading-tight',
                            isMet ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                          )}
                        >
                          {isMet ? (
                            <Check className="size-3 sm:size-3.5 shrink-0 mt-0.5" />
                          ) : (
                            <X className="size-3 sm:size-3.5 shrink-0 mt-0.5" />
                          )}
                          <span className="wrap-break-word">{requirement.label}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  showPasswordLabel={t('auth.showPassword')}
                  hidePasswordLabel={t('auth.hidePassword')}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword?.message && (
                  <p className="text-sm text-red-500">{t(errors.confirmPassword.message)}</p>
                )}
              </div>
              <Button disabled={isSubmitting} type="submit" className="w-full">
                {t('auth.createAccount')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm px-4">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/login" className="underline underline-offset-4">
          {t('auth.login')}
        </Link>
      </div>
      <div className="text-muted-foreground text-center text-xs text-balance px-4">
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
