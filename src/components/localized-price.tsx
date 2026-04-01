import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCurrencyLocalization } from '@/hooks/use-currency-localization'
import { cn } from '@/lib/utils'

interface ILocalizedPriceProps {
  pricePLN: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showToggle?: boolean
  showDisclaimer?: boolean
}

export function LocalizedPrice({
  pricePLN,
  className,
  size = 'md',
  showToggle = false,
  showDisclaimer = false,
}: ILocalizedPriceProps) {
  const { t } = useTranslation()
  const { formatPrice, currencyDisclaimer, isLoading, showOriginalPrice, togglePriceView } =
    useCurrencyLocalization()

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm gap-1'
      case 'md':
        return 'text-lg gap-2'
      case 'lg':
        return 'text-2xl gap-2'
      case 'xl':
        return 'text-4xl gap-2'
      default:
        return 'text-lg gap-2'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3'
      case 'md':
        return 'w-5 h-5'
      case 'lg':
        return 'w-6 h-6'
      case 'xl':
        return 'w-8 h-8'
      default:
        return 'w-5 h-5'
    }
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn('flex items-center font-extrabold text-primary', getSizeClasses())}>
        <span className={cn({ 'animate-pulse': isLoading })}>{formatPrice(pricePLN)}</span>

        {isLoading && (
          <RefreshCw className={cn(getIconSize(), 'animate-spin text-muted-foreground')} />
        )}
      </div>

      {/* Currency toggle button */}
      {showToggle && currencyDisclaimer && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePriceView}
                className="ml-2 h-auto p-1"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-48">
                {showOriginalPrice
                  ? t('currency.showLocalizedPrice', 'Show localized price')
                  : t('currency.showOriginalPrice', 'Show original PLN price')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Currency disclaimer */}
      {showDisclaimer && currencyDisclaimer && !showOriginalPrice && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 ml-2 text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-64">{currencyDisclaimer}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

interface ILocalizedPriceBadgeProps {
  pricePLN: number
  className?: string
}

/**
 * Compact price badge for use in cards and lists
 */
export function LocalizedPriceBadge({ pricePLN, className }: ILocalizedPriceBadgeProps) {
  const { formatPrice } = useCurrencyLocalization()

  return (
    <Badge variant="secondary" className={cn('font-semibold', className)}>
      {formatPrice(pricePLN)}
    </Badge>
  )
}
