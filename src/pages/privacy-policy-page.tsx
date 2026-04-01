import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useDocumentTitle } from '@/hooks/use-document-title'

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation()
  useDocumentTitle('pages.privacyPolicy.title')

  return (
    <div className="relative mx-auto max-w-4xl p-6 md:p-8">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('pages.privacyPolicy.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('pages.privacyPolicy.lastUpdated')}
          </p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.introduction.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.introduction.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.dataCollection.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.dataCollection.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.privacyPolicy.sections.dataCollection.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.dataUsage.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.dataUsage.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.privacyPolicy.sections.dataUsage.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.dataSharing.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.dataSharing.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.privacyPolicy.sections.dataSharing.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.dataSecurity.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.dataSecurity.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.yourRights.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.yourRights.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.privacyPolicy.sections.yourRights.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.cookies.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.cookies.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.privacyPolicy.sections.contact.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.privacyPolicy.sections.contact.content')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
