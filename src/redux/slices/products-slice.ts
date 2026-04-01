import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { apiRequest } from '@/utils/api'
import type {
  IPaginationApi,
  IProductApi,
  IProductsListResponseApi,
  IProductDetailResponseApi,
} from '@/types/product-api'
import type { IProductUi } from '@/types/product-ui'
import { mapProductsApiToUi, mapProductApiToUi } from '@/pages/products/utils/product-mappers'

// Pagination metadata interface for UI components
interface IPaginationMetadata {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Cache interface for products
interface IProductsCache {
  items: IProductApi[]
  pagination: IPaginationApi | null
  filters: {
    search: string
    sortBy: string | null
    page: number
    limit: number
  }
  isFetched: boolean
}

// State interface
interface IProductsState {
  products: IProductsCache
  currentBySlug: Record<string, IProductApi>
  isLoadingList: boolean
  isLoadingDetails: boolean
  errorList: string | null
  errorDetails: string | null
}

// Selector helpers to convert API data to UI format on demand
export const selectProductsAsUi = (products: IProductApi[], locale: string): IProductUi[] =>
  mapProductsApiToUi(products, locale)

export const selectProductAsUi = (
  product: IProductApi | undefined,
  locale: string
): IProductUi | undefined => (product ? mapProductApiToUi(product, locale) : undefined)

// Selector helper to convert API pagination to UI pagination metadata
export const selectPaginationMetadata = (
  pagination: IPaginationApi | null
): IPaginationMetadata | null => {
  if (!pagination) return null
  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPreviousPage: pagination.page > 1,
  }
}

// Initial cache state
const initialCacheState: IProductsCache = {
  items: [],
  pagination: null,
  filters: {
    search: '',
    sortBy: null,
    page: 1,
    limit: 50,
  },
  isFetched: false,
}

// Initial state
const initialState: IProductsState = {
  products: { ...initialCacheState },
  currentBySlug: {},
  isLoadingList: false,
  isLoadingDetails: false,
  errorList: null,
  errorDetails: null,
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: {
      locale: string
      search?: string
      page?: number
      limit?: number
      sortBy?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams()

      queryParams.append('locale', params.locale)

      if (params.search) queryParams.append('search', params.search)
      if (params.page) queryParams.append('page', String(params.page))
      if (params.limit) queryParams.append('limit', String(params.limit))
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)

      const response = await apiRequest<IProductsListResponseApi>(
        `/products?${queryParams.toString()}`
      )

      return {
        products: response.data.products,
        pagination: response.data.pagination,
        filters: {
          search: params.search || '',
          sortBy: params.sortBy || null,
          page: params.page || 1,
          limit: params.limit || 50,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('errors.unknownError')
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest<IProductDetailResponseApi>(`/products/${slug}`)

      return {
        slug,
        product: response.data.product,
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('errors.unknownError')
    }
  }
)

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.products.filters.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.products.filters.limit = action.payload
    },
    clearCurrentProduct: state => {
      state.currentBySlug = {}
    },
    clearErrors: state => {
      state.errorList = null
      state.errorDetails = null
    },
    clearProducts: state => {
      state.products = { ...initialCacheState }
      state.errorList = null
    },
  },
  extraReducers: builder => {
    // Fetch products list
    builder
      .addCase(fetchProducts.pending, state => {
        state.isLoadingList = true
        state.errorList = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoadingList = false
        state.products.items = action.payload.products
        state.products.pagination = action.payload.pagination
        state.products.filters = {
          search: action.payload.filters.search,
          sortBy: action.payload.filters.sortBy,
          page: action.payload.filters.page,
          limit: action.payload.filters.limit,
        }
        state.products.isFetched = true
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoadingList = false
        state.errorList = action.payload as string
      })

    // Fetch product by slug
    builder
      .addCase(fetchProductBySlug.pending, state => {
        state.isLoadingDetails = true
        state.errorDetails = null
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoadingDetails = false
        state.currentBySlug[action.payload.slug] = action.payload.product
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoadingDetails = false
        state.errorDetails = action.payload as string
      })
  },
})

export const { setPage, setLimit, clearCurrentProduct, clearErrors, clearProducts } =
  productsSlice.actions

export default productsSlice.reducer
