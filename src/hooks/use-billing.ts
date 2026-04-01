import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
import type {
  IInvoice,
  IInvoicesResponse,
  IInvoiceQueryParams,
  IInvoicePagination,
} from '@/types/billing'
import { useTranslation } from 'react-i18next'
import { apiRequest } from '@/utils/api'

interface IUseBillingReturn {
  invoices: IInvoice[]
  isLoading: boolean
  error: string | null
  pagination: IInvoicePagination | null
  fetchInvoices: (params?: IInvoiceQueryParams) => Promise<void>
  openPaymentPortal: () => Promise<void>
}

interface ICreateCustomerPortalSessionResponse {
  portalUrl: string
}

export const fetchUserInvoices = async (
  params: IInvoiceQueryParams = {}
): Promise<IInvoicesResponse> => {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString())
  }
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString())
  }
  if (params.startingAfter) {
    searchParams.append('startingAfter', params.startingAfter)
  }
  if (params.endingBefore) {
    searchParams.append('endingBefore', params.endingBefore)
  }

  const queryString = searchParams.toString()
  const endpoint = `/payments/invoices${queryString ? `?${queryString}` : ''}`

  return apiRequest<IInvoicesResponse>(endpoint, {
    method: 'GET',
  })
}

/**
 * Create a Stripe Customer Portal session for the currently authenticated user.
 *
 * @returns Promise with a portal URL to redirect the user to.
 */
export const createCustomerPortalSession =
  async (): Promise<ICreateCustomerPortalSessionResponse> =>
    apiRequest<ICreateCustomerPortalSessionResponse>('/payments/create-portal-session', {
      method: 'POST',
    })

export const useBilling = (_customerId: string): IUseBillingReturn => {
  const [invoices, setInvoices] = useState<IInvoice[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<IInvoicePagination | null>(null)
  const { user } = useAuth()
  const { t } = useTranslation()

  const fetchInvoices = useCallback(
    async (params: IInvoiceQueryParams = {}) => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        const response: IInvoicesResponse = await fetchUserInvoices(params)
        setInvoices(response.data)
        setPagination(response.pagination)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('billing.error.description')
        setError(errorMessage)
        setInvoices([])
        setPagination(null)
      } finally {
        setIsLoading(false)
      }
    },
    [user, t]
  )

  const openPaymentPortal = async () => {
    try {
      if (!user) {
        throw new Error('errors.authenticationRequired')
      }

      const { portalUrl } = await createCustomerPortalSession()
      window.location.href = portalUrl
    } catch (err) {
      console.error('Error opening payment portal:', err)
      throw err
    }
  }

  // Initial load effect - separate from the fetchInvoices function to avoid dependency loops
  useEffect(() => {
    let cancelled = false

    const loadInitialInvoices = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        const response: IInvoicesResponse = await fetchUserInvoices()
        if (!cancelled) {
          setInvoices(response.data)
          setPagination(response.pagination)
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : t('billing.error.description')
          setError(errorMessage)
          setInvoices([])
          setPagination(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadInitialInvoices()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    invoices,
    isLoading,
    error,
    pagination,
    fetchInvoices,
    openPaymentPortal,
  }
}
