import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { apiRequest } from '@/utils/api'
import type {
  IConsultationRequest,
  IConsultationRequestsResponse,
  TConsultationStatus,
} from '@/types/consultation'

function StatusBadge({ status }: { status: TConsultationStatus }) {
  const { t } = useTranslation()
  const variants: Record<TConsultationStatus, 'default' | 'secondary' | 'destructive'> = {
    pending: 'secondary',
    accepted: 'default',
    rejected: 'destructive',
  }
  return <Badge variant={variants[status]}>{t(`consultationRequest.status.${status}`)}</Badge>
}

export const MyRequestsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  useDocumentTitle('consultationRequest.myRequests.title')

  const [requests, setRequests] = React.useState<IConsultationRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    apiRequest<IConsultationRequestsResponse>('/consultation-requests/my')
      .then(res => setRequests(res.data ?? []))
      .catch(e => setError(e?.message || t('errors.unknownError')))
      .finally(() => setIsLoading(false))
  }, [t])

  const specialistLabels = React.useMemo<Record<string, string>>(
    () => ({
      gynecologist: t('consultationRequest.specialists.gynecologist'),
      fertility_specialist: t('consultationRequest.specialists.fertilitySpecialist'),
      endocrinologist: t('consultationRequest.specialists.endocrinologist'),
    }),
    [t]
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('consultationRequest.myRequests.title')}</h1>
        <p className="text-muted-foreground">{t('consultationRequest.myRequests.description')}</p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">{t('patients.loading')}</div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {t('consultationRequest.myRequests.empty')}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl">
          {requests.map(req => (
            <Card key={req.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-base">
                    {specialistLabels[req.specialistType] ?? req.specialistType}
                  </CardTitle>
                  <StatusBadge status={req.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {t('consultationRequest.myRequests.sentAt')}:{' '}
                  {new Date(req.createdAt).toLocaleDateString(i18n.language)}
                </p>
                {req.description && <p className="text-foreground">{req.description}</p>}
                {req.status === 'rejected' && req.rejectionReason && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {t('consultationRequest.myRequests.rejectedReason')}: {req.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
