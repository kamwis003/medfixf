import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import {
  formatLocalizedPrice,
  getCurrencyDisclaimer,
  fetchExchangeRates,
  type IExchangeRates,
} from '@/utils/currency-localization'

interface IUseCurrencyLocalizationReturn {
  formatPrice: (pricePLN: number) => string
  currencyDisclaimer: string
  isLoading: boolean
  exchangeRates: IExchangeRates | null
  showOriginalPrice: boolean
  togglePriceView: () => void
}

/**
 * Hook for handling currency localization in the UI
 */
export function useCurrencyLocalization(): IUseCurrencyLocalizationReturn {
  const { i18n, t } = useTranslation()
  const [exchangeRates, setExchangeRates] = useState<IExchangeRates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOriginalPrice, setShowOriginalPrice] = useState(false)

  const currentLocale = i18n.language

  // Fetch exchange rates on mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      setIsLoading(true)
      try {
        const rates = await fetchExchangeRates()
        setExchangeRates(rates)
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
        setExchangeRates(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadExchangeRates()
  }, [])

  const formatPrice = (pricePLN: number): string => {
    if (showOriginalPrice || currentLocale === 'pl') {
      return formatLocalizedPrice(pricePLN, 'pl', exchangeRates || undefined)
    }

    return formatLocalizedPrice(pricePLN, currentLocale, exchangeRates || undefined)
  }

  const currencyDisclaimer = getCurrencyDisclaimer(currentLocale, t)

  const togglePriceView = () => {
    setShowOriginalPrice(!showOriginalPrice)
  }

  return {
    formatPrice,
    currencyDisclaimer,
    isLoading,
    exchangeRates,
    showOriginalPrice,
    togglePriceView,
  }
}
