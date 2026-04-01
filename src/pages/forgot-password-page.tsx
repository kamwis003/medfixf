import { useTranslation } from 'react-i18next'

import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Logo } from '@/assets/logo'

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  useDocumentTitle('pages.forgotPassword')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-4 self-center text-2xl font-semibold">
          <Logo className="h-14 w-auto" />
          <span>{t('app.name')}</span>
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
