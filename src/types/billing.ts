export interface IInvoice {
  id: string
  number: string
  amount: number
  currency: string
  status: TStatusBilling
  created: number // Unix timestamp from Stripe
  description: string
  downloadUrl?: string // Optional for backward compatibility
  invoicePdf?: string // Stripe PDF URL
  hostedInvoiceUrl?: string // Stripe hosted invoice URL
  paidAt?: number // Unix timestamp when paid
}

export interface ISubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  isActive: boolean
  features: string[]
  description?: string
}

export interface IBillingData {
  subscription: ISubscriptionPlan | null
  invoices: IInvoice[]
  customerId: string
}

export type TStatusBilling = 'paid' | 'pending' | 'failed' | 'draft'

export interface IInvoicePagination {
  page: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
  nextCursor?: string | null
  previousCursor?: string | null
}

export interface IInvoicesResponse {
  data: IInvoice[]
  pagination: IInvoicePagination
}

export interface IInvoiceQueryParams {
  page?: number
  limit?: number
  startingAfter?: string
  endingBefore?: string
}
