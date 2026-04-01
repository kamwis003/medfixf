/**
 * Currency localization utilities for displaying prices in different currencies
 * while maintaining PLN as the base currency for business operations
 */

export interface ICurrencyConfig {
  code: string
  symbol: string
  position: 'before' | 'after'
  format: (amount: number) => string
}

export interface IExchangeRates {
  USD?: number
  UAH?: number
  PLN: 1 // Base currency
}

// Currency configurations for different locales
export const CURRENCY_CONFIGS: Record<string, ICurrencyConfig> = {
  en: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    format: (amount: number) => `$${amount.toFixed(2)}`,
  },
  uk: {
    code: 'UAH',
    symbol: '₴',
    position: 'after',
    format: (amount: number) => `${amount.toFixed(2)} ₴`,
  },
  pl: {
    code: 'PLN',
    symbol: 'zł',
    position: 'after',
    format: (amount: number) => `${amount.toFixed(2)} zł`,
  },
}

/**
 * Convert PLN price to target currency
 */
export function convertPrice(
  pricePLN: number,
  targetCurrency: keyof IExchangeRates,
  exchangeRates?: IExchangeRates
): number | null {
  if (!exchangeRates || !exchangeRates[targetCurrency]) {
    return null
  }
  return pricePLN * exchangeRates[targetCurrency]!
}

/**
 * Format price for display based on locale
 */
export function formatLocalizedPrice(
  pricePLN: number,
  locale: string,
  exchangeRates?: IExchangeRates
): string {
  const config = CURRENCY_CONFIGS[locale] || CURRENCY_CONFIGS['pl']

  if (config.code === 'PLN' || !exchangeRates) {
    return config.format(pricePLN)
  }

  const targetCurrency = config.code as keyof IExchangeRates
  const convertedPrice = convertPrice(pricePLN, targetCurrency, exchangeRates)

  if (convertedPrice === null) {
    return `${pricePLN.toFixed(2)} PLN`
  }

  return config.format(convertedPrice)
}

/**
 * Get currency info text for transparency
 */
export function getCurrencyDisclaimer(
  locale: string,
  t?: (key: string, options?: any) => string
): string {
  const config = CURRENCY_CONFIGS[locale]
  if (!config || config.code === 'PLN') {
    return ''
  }

  if (t) {
    return t('currency.disclaimer', { currency: config.code })
  }

  return `Prices shown in ${config.code} are estimates. Final payment processed in PLN.`
}

export async function fetchExchangeRates(): Promise<IExchangeRates> {
  const fallbackUrls = [
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/pln.min.json',
    'https://latest.currency-api.pages.dev/v1/currencies/pln.json',
  ]

  for (const url of fallbackUrls) {
    try {
      const response = await fetch(url)
      const data = await response.json()

      return {
        USD: data.pln?.usd,
        UAH: data.pln?.uah,
        PLN: 1,
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error)
      continue
    }
  }

  throw new Error('All currency APIs failed')
}
