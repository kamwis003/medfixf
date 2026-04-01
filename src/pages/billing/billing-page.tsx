import { FileText, AlertCircle } from 'lucide-react'
import { useBilling } from '@/hooks/use-billing'
import { InvoicesTable } from '@/pages/billing/components/invoices-table'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PaymentManagementCard } from '@/pages/billing/components/payment-management-card'
import { useState } from 'react'

export const BillingPage = () => {
  useDocumentTitle('pages.billing')
  const { t } = useTranslation()
  const { user } = useAuth()

  const customerId = user?.id || 'mock-customer-id'

  const { invoices, isLoading, error, pagination, fetchInvoices, openPaymentPortal } =
    useBilling(customerId)
  const [isOpeningPortal, setIsOpeningPortal] = useState<boolean>(false)

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true)
    try {
      await openPaymentPortal()
    } catch (portalError) {
      console.error('Error opening payment portal:', portalError)
    } finally {
      setIsOpeningPortal(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
      <div className="grid auto-rows-min gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('pages.billing')}</h1>
          <p className="text-muted-foreground mt-2">{t('billing.description')}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('billing.error.description')}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <PaymentManagementCard
            onManageSubscription={handleManageSubscription}
            isLoading={isOpeningPortal}
          />
        </div>

        <div className="space-y-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">{t('billing.invoices.title')}</h2>
          </div>

          <InvoicesTable
            invoices={invoices}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={fetchInvoices}
          />
        </div>
      </div>
    </div>
  )
}
