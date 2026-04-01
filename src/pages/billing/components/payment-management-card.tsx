import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface IPaymentManagementCardProps {
  onManageSubscription: () => void
  isLoading: boolean
}

export const PaymentManagementCard = ({
  onManageSubscription,
  isLoading,
}: IPaymentManagementCardProps) => {
  const { t } = useTranslation()

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('billing.paymentManagement.title')}
        </CardTitle>
        <CardDescription>{t('billing.paymentManagement.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-justify text-sm">
          {t('billing.paymentManagement.descriptionText')}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onManageSubscription} className="w-full" disabled={isLoading}>
          <CreditCard className="mr-2 h-4 w-4" />
          {t('billing.paymentManagement.openPortal')}
        </Button>
      </CardFooter>
    </Card>
  )
}
