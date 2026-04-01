import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function PaymentCancelledPage() {
  useDocumentTitle('payment.cancelled')
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-orange-600">{t('payment.cancelled')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t('payment.cancelledMessage')}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.HOME)} className="flex-1">
              {t('payment.backToCourses')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
