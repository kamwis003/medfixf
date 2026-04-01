/**
 * Raw API types matching backend Swagger schema
 */

export interface IProductApi {
  slug: string
  nameTranslations: Record<string, string>
  descriptionTranslations: Record<string, string>
  price: number
  stripeProductId: string
  stripePriceId: string
  isPurchased: boolean
  createdAt: string
  updatedAt: string
}

export interface IPaginationApi {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface IProductsListResponseApi {
  success: true
  data: {
    products: IProductApi[]
    pagination: IPaginationApi
  }
}

export interface IProductDetailResponseApi {
  success: true
  data: {
    product: IProductApi
  }
}

export interface IFetchProductsParams {
  locale: string
  search?: string
  isPurchased?: boolean
  page?: number
  limit?: number
  sortBy?: string
}
