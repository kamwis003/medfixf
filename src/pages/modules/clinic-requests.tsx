import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { apiRequest } from '@/utils/api'
import type {
  IClinicConsultationRequest,
  IClinicConsultationRequestsResponse,
  TConsultationStatus,
} from '@/types/consultation'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

function StatusBadge({ status }: { status: TConsultationStatus }) {
  const { t } = useTranslation()
  const variants: Record<TConsultationStatus, 'default' | 'secondary' | 'destructive'> = {
    pending: 'secondary',
    accepted: 'default',
    rejected: 'destructive',
  }
  const icons: Record<TConsultationStatus, React.ReactNode> = {
    pending: <Clock className="h-3 w-3" />,
    accepted: <CheckCircle className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
  }
  return (
    <Badge variant={variants[status]} className="flex items-center gap-1 w-fit">
      {icons[status]}
      {t(`consultationRequest.status.${status}`)}
    </Badge>
  )
}

interface IRejectDialogProps {
  onConfirm: (reason: string) => void
  onCancel: () => void
  isLoading: boolean
}

function RejectDialog({ onConfirm, onCancel, isLoading }: IRejectDialogProps) {
  const { t } = useTranslation()
  const [reason, setReason] = React.useState('')

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <Label className="text-sm font-medium">{t('consultationRequest.clinic.rejectReason')}</Label>
      <Textarea
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder={t('consultationRequest.clinic.rejectReasonPlaceholder')}
        rows={3}
        className="resize-none"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          disabled={isLoading}
          onClick={() => onConfirm(reason)}
        >
          <XCircle className="mr-1 h-4 w-4" />
          {t('consultationRequest.clinic.confirmReject')}
        </Button>
        <Button size="sm" variant="outline" disabled={isLoading} onClick={onCancel}>
          {t('consultationRequest.clinic.cancelReject')}
        </Button>
      </div>
    </div>
  )
}

export const ClinicRequestsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  useDocumentTitle('consultationRequest.clinic.title')

  const [requests, setRequests] = React.useState<IClinicConsultationRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)
  const [rejectingId, setRejectingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    apiRequest<IClinicConsultationRequestsResponse>('/consultation-requests')
      .then(res => setRequests(res.data ?? []))
      .catch(e => setError(e?.message || t('errors.unknownError')))
      .finally(() => setIsLoading(false))
  }, [t])

  const updateStatus = async (
    id: string,
    status: 'accepted' | 'rejected',
    rejectionReason?: string
  ) => {
    setActionLoading(id)
    try {
      await apiRequest(`/consultation-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      })
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status, rejectionReason: rejectionReason ?? r.rejectionReason } : r
        )
      )
      setRejectingId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errors.unknownError'))
    } finally {
      setActionLoading(null)
    }
  }

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
        <h1 className="text-3xl font-bold">{t('consultationRequest.clinic.title')}</h1>
        <p className="text-muted-foreground">{t('consultationRequest.clinic.description')}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">{t('patients.loading')}</div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {t('consultationRequest.clinic.empty')}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(req => (
            <Card key={req.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {req.patient.firstName} {req.patient.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{req.patient.email}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">
                      {t('consultationRequest.clinic.specialist')}:
                    </span>{' '}
                    {specialistLabels[req.specialistType] ?? req.specialistType}
                  </span>
                  <span>
                    {t('consultationRequest.clinic.sentAt')}:{' '}
                    {new Date(req.createdAt).toLocaleDateString(i18n.language)}
                  </span>
                </div>

                {req.description && (
                  <p className="text-foreground rounded-md bg-muted/50 p-3">{req.description}</p>
                )}

                {req.status === 'rejected' && req.rejectionReason && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {t('consultationRequest.clinic.rejectedReason')}: {req.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}

                {req.status === 'pending' && (
                  <>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === req.id}
                        onClick={() => updateStatus(req.id, 'accepted')}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {t('consultationRequest.clinic.accept')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === req.id}
                        onClick={() => setRejectingId(rejectingId === req.id ? null : req.id)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        {t('consultationRequest.clinic.reject')}
                      </Button>
                    </div>
                    {rejectingId === req.id && (
                      <RejectDialog
                        isLoading={actionLoading === req.id}
                        onConfirm={reason => updateStatus(req.id, 'rejected', reason)}
                        onCancel={() => setRejectingId(null)}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
