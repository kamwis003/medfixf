import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, FileText, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'
import type {
  IInvoice,
  TStatusBilling,
  IInvoicePagination,
  IInvoiceQueryParams,
} from '@/types/billing'
import { formatAmount, formatDate } from './invoice-table.utils'

interface ITableInvoicesProps {
  invoices: IInvoice[]
  isLoading?: boolean
  pagination: IInvoicePagination | null
  onPageChange: (params: IInvoiceQueryParams) => Promise<void>
}

export const InvoicesTable = ({
  invoices,
  isLoading = false,
  pagination,
  onPageChange,
}: ITableInvoicesProps) => {
  const { t, i18n } = useTranslation()
  const isMobile = useIsMobile()
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)

  const handleDownload = async (invoice: IInvoice) => {
    setDownloadingInvoice(invoice.id)
    try {
      // Use the Stripe PDF URL or hosted invoice URL
      const downloadUrl = invoice.invoicePdf || invoice.hostedInvoiceUrl || invoice.downloadUrl
      if (!downloadUrl) {
        throw new Error('No download URL available')
      }

      // For Stripe URLs (both PDF and hosted), always open in new tab
      if (invoice.invoicePdf || invoice.hostedInvoiceUrl) {
        window.open(downloadUrl, '_blank')
      } else if (invoice.downloadUrl) {
        try {
          const response = await fetch(downloadUrl)
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `invoice-${invoice.number}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        } catch (fetchError) {
          window.open(downloadUrl, '_blank')
        }
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const getStatusVariant = (status: TStatusBilling) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      case 'draft':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: TStatusBilling) => {
    switch (status) {
      case 'paid':
        return t('billing.invoices.statuses.paid')
      case 'pending':
        return t('billing.invoices.statuses.pending')
      case 'failed':
        return t('billing.invoices.statuses.failed')
      case 'draft':
        return t('billing.invoices.statuses.draft')
      default:
        return status
    }
  }

  const handlePreviousPage = async () => {
    if (pagination?.hasPreviousPage) {
      await onPageChange({
        page: pagination.previousPage!,
        limit: pagination.limit,
        endingBefore: pagination.previousCursor || undefined,
      })
    }
  }

  const handleNextPage = async () => {
    if (pagination?.hasNextPage) {
      await onPageChange({
        page: pagination.nextPage!,
        limit: pagination.limit,
        startingAfter: pagination.nextCursor || undefined,
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-3">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="px-4">
        {invoices.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
            <p>{t('billing.invoices.noInvoices')}</p>
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="space-y-3">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{invoice.number}</span>
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {invoice.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(invoice)}
                        disabled={downloadingInvoice === invoice.id}
                        aria-label={`${t('billing.invoices.download')} ${invoice.number}`}
                        className="h-8 w-8 shrink-0 p-0"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">
                          {downloadingInvoice === invoice.id
                            ? t('billing.invoices.downloading')
                            : t('billing.invoices.download')}
                        </span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(i18n.language, invoice.created)}</span>
                      </div>
                      <span className="font-medium">
                        {formatAmount(i18n.language, invoice.amount, invoice.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden lg:table-cell">
                        {t('billing.invoices.invoiceNumber')}
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        {t('billing.invoices.issueDate')}
                      </TableHead>
                      <TableHead className="min-w-30">{t('billing.invoices.amount')}</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        {t('billing.invoices.status')}
                      </TableHead>
                      <TableHead className="hidden xl:table-cell">
                        {t('billing.invoices.description')}
                      </TableHead>
                      <TableHead className="w-20 text-right">
                        {t('billing.invoices.actions')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map(invoice => (
                      <TableRow key={invoice.id}>
                        <TableCell className="hidden font-medium lg:table-cell">
                          {invoice.number}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-muted-foreground h-4 w-4" />
                            {formatDate(i18n.language, invoice.created)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium lg:hidden">{invoice.number}</span>
                            {formatAmount(i18n.language, invoice.amount, invoice.currency)}
                            <div className="flex items-center gap-2 lg:hidden">
                              <Calendar className="text-muted-foreground h-3 w-3" />
                              <span className="text-muted-foreground text-xs">
                                {formatDate(i18n.language, invoice.created)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusLabel(invoice.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden max-w-xs truncate xl:table-cell">
                          {invoice.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Badge variant={getStatusVariant(invoice.status)} className="sm:hidden">
                              {getStatusLabel(invoice.status)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(invoice)}
                              disabled={downloadingInvoice === invoice.id}
                              aria-label={`${t('billing.invoices.download')} ${invoice.number}`}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">
                                {downloadingInvoice === invoice.id
                                  ? t('billing.invoices.downloading')
                                  : t('billing.invoices.download')}
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {pagination && (pagination.hasNextPage || pagination.hasPreviousPage) && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-muted-foreground text-center text-sm sm:text-left">
                  {t('billing.invoices.showing', {
                    from: (pagination.page - 1) * pagination.limit + 1,
                    to: Math.min(
                      pagination.page * pagination.limit,
                      (pagination.page - 1) * pagination.limit + invoices.length
                    ),
                    total: '?', // We don't have total count from backend
                  })}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center justify-center gap-4 sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!pagination?.hasPreviousPage}
                      className="h-10 w-10 p-0"
                      aria-label={t('billing.invoices.previous')}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="px-3 py-1">
                        {pagination?.page || 1}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination?.hasNextPage}
                      className="h-10 w-10 p-0"
                      aria-label={t('billing.invoices.next')}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="hidden items-center gap-4 sm:flex">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!pagination?.hasPreviousPage}
                      className="h-10 w-10 p-0"
                      aria-label={t('billing.invoices.previous')}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {pagination?.page || 1}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination?.hasNextPage}
                      className="h-10 w-10 p-0"
                      aria-label={t('billing.invoices.next')}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
