import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CreditCard, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ISubscriptionPlan } from '@/types/billing'
import { LocalizedPrice } from '@/components/localized-price'

interface ISubscriptionCardProps {
  subscription: ISubscriptionPlan | null
  onManageSubscription: () => void
  isLoading?: boolean
}

export const SubscriptionCard = ({
  subscription,
  onManageSubscription,
  isLoading = false,
}: ISubscriptionCardProps) => {
  const { t } = useTranslation()
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('billing.subscription.noSubscription')}
          </CardTitle>
          <CardDescription>{t('billing.subscription.noSubscriptionDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1"></CardContent>
        <CardFooter>
          <Button onClick={onManageSubscription} className="w-full">
            {t('billing.subscription.selectPlan')}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {subscription.name}
          </div>
          <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
            {subscription.isActive
              ? t('billing.subscription.active')
              : t('billing.subscription.inactive')}
          </Badge>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <LocalizedPrice
              pricePLN={subscription.price}
              size="sm"
              showToggle={false}
              showDisclaimer={false}
            />
            <span>/ {subscription.interval === 'month' ? 'miesiąc' : 'rok'}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div>
          <h4 className="mb-2 font-medium">{t('billing.subscription.planFeatures')}</h4>
          <ul className="space-y-1">
            {subscription.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onManageSubscription} variant="outline" className="w-full">
          {t('billing.subscription.manageSubscription')}
        </Button>
      </CardFooter>
    </Card>
  )
}
