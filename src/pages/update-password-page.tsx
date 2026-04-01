import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@/hooks/use-document-title'
import { UpdatePasswordForm } from '@/components/update-password-form'
import { Logo } from '@/assets/logo'
import { ROUTES } from '@/routes/paths'

function hasValidUpdatePasswordParams(searchParams: URLSearchParams): boolean {
  const hasEmail = !!searchParams.get('email')
  const hasCodeOrToken = searchParams.has('code') || searchParams.has('token_hash')
  return hasEmail && hasCodeOrToken
}

export const UpdatePasswordPage = () => {
  const { t } = useTranslation()
  useDocumentTitle('updatePassword.title')
  const location = useLocation()
  const navigate = useNavigate()

  const hasValidParams = React.useMemo(() => {
    return hasValidUpdatePasswordParams(new URLSearchParams(location.search))
  }, [location.search])

  React.useEffect(() => {
    if (!hasValidParams) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [hasValidParams, navigate])

  if (!hasValidParams) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-4 self-center text-2xl font-semibold">
          <Logo className="h-14 w-auto" />
          <span>{t('app.name')}</span>
        </a>
        <UpdatePasswordForm />
      </div>
    </div>
  )
}
