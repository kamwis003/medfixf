import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function PaymentSuccessPage() {
  useDocumentTitle('payment.success')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    redirectTimeoutRef.current = setTimeout(() => {
      navigate(ROUTES.HOME, { replace: true })
    }, 5000)

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">{t('payment.success')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t('payment.successMessage')}</p>
          <p className="text-sm text-muted-foreground mb-6">{t('payment.redirecting')}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => navigate(ROUTES.HOME)} className="flex-1">
              {t('payment.goToMyCourses')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
