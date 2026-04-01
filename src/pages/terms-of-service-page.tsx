import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useDocumentTitle } from '@/hooks/use-document-title'

export const TermsOfServicePage = () => {
  const { t } = useTranslation()
  useDocumentTitle('pages.termsOfService.title')

  return (
    <div className="relative mx-auto max-w-4xl p-6 md:p-8">
      <div className="absolute right-4 top-4 flex items-center gap-2 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">{t('pages.termsOfService.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('pages.termsOfService.lastUpdated')}
          </p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.acceptance.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.acceptance.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.description.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.description.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.userAccounts.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.userAccounts.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.termsOfService.sections.userAccounts.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.acceptableUse.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.acceptableUse.content')}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              {(
                t('pages.termsOfService.sections.acceptableUse.items', {
                  returnObjects: true,
                }) as string[]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.intellectualProperty.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.intellectualProperty.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.disclaimer.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.disclaimer.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.limitation.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.limitation.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.termination.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.termination.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.changes.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.changes.content')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              {t('pages.termsOfService.sections.contact.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.termsOfService.sections.contact.content')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
