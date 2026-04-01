import { formatLocalizedPrice } from '@/utils/currency-localization'

export const formatDate = (locale: string, dateInput: string | number) => {
  // Handle both string dates and Unix timestamps
  const date =
    typeof dateInput === 'number'
      ? new Date(dateInput * 1000) // Convert Unix timestamp to milliseconds
      : new Date(dateInput)

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatAmount = (locale: string, amount: number, _currency: string) => {
  // Convert amount from cents to actual value and use localized pricing
  const amountInPLN = amount / 100
  return formatLocalizedPrice(amountInPLN, locale)
}
