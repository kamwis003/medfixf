import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Logo } from '@/assets/logo'
import { LoginForm } from '@/components/login-form'

export const LoginPage = () => {
  const { t } = useTranslation()
  useDocumentTitle('pages.login')

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-4 self-center text-2xl font-semibold">
          <Logo className="h-14 w-auto" />
          <span>{t('app.name')}</span>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
