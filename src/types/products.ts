/**
 * @deprecated Legacy course-based types. Use product-ui.ts for new code.
 */
export type TProductBillingType = 'one_time' | 'recurring'

/**
 * @deprecated Legacy course-based types. Use product-ui.ts for new code.
 */
export interface IProductBilling {
  type: TProductBillingType
  priceId: string | null
  unitAmount: number | null
  currency: string | null
}

/**
 * @deprecated Use IProductUi from product-ui.ts
 */
export interface IProduct {
  slug: string
  title: string
  duration: number
  price: number
  rating: number
  description?: string
  purchased?: boolean
  purchaseDate?: string
  reviews?: number
  progress?: number
  billing?: IProductBilling | null
}

// Keep TViewMode and TabMode here for now (shared)
export type TViewMode = 'grid' | 'list'
export type TabMode = 'available' | 'purchased'
