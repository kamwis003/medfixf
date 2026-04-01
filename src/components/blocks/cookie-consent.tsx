import * as React from 'react'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getCookie, setCookie } from '@/utils/cookies'

/**
 * Cookie Consent Banner
 *
 * Currently manages consent for ESSENTIAL cookies only:
 * - cookieConsent: Stores user's consent choice (1 year)
 * - sidebar_state: UI preference for sidebar state (7 days)
 * - Supabase auth tokens: Stored in localStorage (not cookies)
 *
 * Future expansion (when analytics/tracking added):
 * - Set isDeclineShown={true} to show decline option
 * - Implement cookie categorization (Essential, Functional, Analytics, Marketing)
 * - Allow granular consent per category
 * - Add cookie preference management UI
 */

interface ICookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'small' | 'mini'
  demo?: boolean
  isDeclineShown?: boolean
  onAcceptCallback?: () => void
  onDeclineCallback?: () => void
}

const CookieConsent = React.forwardRef<HTMLDivElement, ICookieConsentProps>(
  (
    {
      variant = 'default',
      demo = false,
      isDeclineShown = true,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = React.useState<boolean>(false)
    const [hide, setHide] = React.useState<boolean>(false)

    const handleAccept = React.useCallback(() => {
      setIsOpen(false)
      setCookie('cookieConsent', 'true', { maxAgeDays: 365 })
      setTimeout(() => {
        setHide(true)
      }, 700)
      onAcceptCallback()
    }, [onAcceptCallback])

    const handleDecline = React.useCallback(() => {
      setIsOpen(false)
      setCookie('cookieConsent', 'false', { maxAgeDays: 365 })
      setTimeout(() => {
        setHide(true)
      }, 700)
      onDeclineCallback()
    }, [onDeclineCallback])

    React.useEffect(() => {
      try {
        setIsOpen(true)
        const consentValue = getCookie('cookieConsent')
        const isConsentDecided = consentValue === 'true' || consentValue === 'false'

        if (isConsentDecided && !demo) {
          setIsOpen(false)
          setTimeout(() => {
            setHide(true)
          }, 700)
        }
      } catch (error) {
        console.warn('Cookie consent error:', error)
      }
    }, [demo])

    if (hide) return null

    const containerClasses = cn(
      'fixed z-50 transition-all duration-700',
      !isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      className
    )

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        variant === 'mini'
          ? 'left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl'
          : 'bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md'
      ),
      ...props,
    }

    if (variant === 'default') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{t('cookieConsent.title')}</CardTitle>
              <Cookie className="h-5 w-5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <CardDescription className="text-sm">
                {t('cookieConsent.description')}
              </CardDescription>
              <p className="text-xs text-muted-foreground">{t('cookieConsent.byClickingAccept')}</p>
              <Link
                to="/privacy-policy"
                className="text-xs text-primary underline underline-offset-4 hover:no-underline"
              >
                {t('cookieConsent.learnMore')}
              </Link>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              {isDeclineShown && (
                <Button onClick={handleDecline} variant="secondary" className="flex-1">
                  {t('cookieConsent.decline')}
                </Button>
              )}
              <Button onClick={handleAccept} className="flex-1">
                {t('cookieConsent.accept')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    if (variant === 'small') {
      return (
        <div {...commonWrapperProps}>
          <Card className="m-3 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
              <CardTitle className="text-base">{t('cookieConsent.title')}</CardTitle>
              <Cookie className="h-4 w-4" />
            </CardHeader>
            <CardContent className="pt-0 pb-2 px-4">
              <CardDescription className="text-sm">
                {t('cookieConsent.description')}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2 h-0 py-2 px-4">
              {isDeclineShown && (
                <Button
                  onClick={handleDecline}
                  variant="secondary"
                  size="sm"
                  className="flex-1 rounded-full"
                >
                  {t('cookieConsent.decline')}
                </Button>
              )}
              <Button onClick={handleAccept} size="sm" className="flex-1 rounded-full">
                {t('cookieConsent.accept')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    if (variant === 'mini') {
      return (
        <div {...commonWrapperProps}>
          <Card className="mx-3 p-0 py-3 shadow-lg">
            <CardContent className="sm:flex grid gap-4 p-0 px-3.5">
              <CardDescription className="text-xs sm:text-sm flex-1">
                {t('cookieConsent.description')}
              </CardDescription>
              <div className="flex items-center gap-2 justify-end sm:gap-3">
                {isDeclineShown && (
                  <Button
                    onClick={handleDecline}
                    size="sm"
                    variant="secondary"
                    className="text-xs h-7"
                  >
                    {t('cookieConsent.decline')}
                    <span className="sr-only sm:hidden">{t('cookieConsent.decline')}</span>
                  </Button>
                )}
                <Button onClick={handleAccept} size="sm" className="text-xs h-7">
                  {t('cookieConsent.accept')}
                  <span className="sr-only sm:hidden">{t('cookieConsent.accept')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }
)

CookieConsent.displayName = 'CookieConsent'
export { CookieConsent }
export default CookieConsent
