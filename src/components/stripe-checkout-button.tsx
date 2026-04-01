import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { withErrorHandling } from '@/utils/error-handling'
import { apiRequest } from '@/utils/api'

type TOneTimeCheckoutSessionRequest = {
  productSlug: string
}

type TPerCourseSubscriptionCheckoutSessionRequest = {
  productSlug: string
  subscription: true
}

type TBundleSubscriptionCheckoutSessionRequest = {
  priceId: string
  productSlugs: string[]
}

export type TCreateCheckoutSessionRequest =
  | TOneTimeCheckoutSessionRequest
  | TPerCourseSubscriptionCheckoutSessionRequest
  | TBundleSubscriptionCheckoutSessionRequest

interface ICreateCheckoutSessionResponse {
  checkoutUrl: string
  sessionId: string
}

interface IStripeCheckoutButtonProps {
  payload: TCreateCheckoutSessionRequest
  label: string
  className?: string
}

export function StripeCheckoutButton({ payload, label, className }: IStripeCheckoutButtonProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCheckout = async () => {
    if (!user) {
      console.error('User not authenticated')
      return
    }

    setIsLoading(true)

    try {
      await withErrorHandling(async () => {
        const data = await apiRequest<ICreateCheckoutSessionResponse>(
          '/payments/create-checkout-session',
          {
            method: 'POST',
            body: JSON.stringify(payload),
          }
        )

        window.location.href = data.checkoutUrl
      })
    } catch (error) {
      console.error('Error creating checkout session:', error)

      if (error instanceof Error) {
        const maybeTranslated =
          error.message.includes('.') || error.message.includes('_')
            ? t(error.message)
            : error.message

        alert(maybeTranslated || t('stripe.checkoutFailed'))
        return
      }

      alert(t('stripe.checkoutFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} size="lg" className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('stripe.processing')}
        </>
      ) : (
        <>{label}</>
      )}
    </Button>
  )
}
