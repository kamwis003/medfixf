/**
 * UI-friendly types with localized fields for components
 */

export interface IProductUi {
  slug: string
  title: string
  description: string
  price: number
  purchased: boolean
  stripePriceId: string
  stripeProductId: string
  createdAt: string
  updatedAt: string
}

// Re-export shared types
export type { TViewMode, TabMode } from './products'
export type { IPaginationApi as IPagination } from './product-api'
