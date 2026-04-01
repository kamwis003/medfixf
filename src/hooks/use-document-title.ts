import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useDocumentTitle = (titleKey: string) => {
  const { t } = useTranslation()

  useEffect(() => {
    const appName = t('app.name')
    const title = titleKey ? `${t(titleKey)} | ${appName}` : appName
    document.title = title
  }, [t, titleKey])
}
