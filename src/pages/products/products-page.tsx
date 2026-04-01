import { useDocumentTitle } from '@/hooks/use-document-title'
import { ProductTabs } from '@/pages/products/components/product-tabs'
import type { IProductUi, TViewMode, TabMode } from '@/types/product-ui'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SmartFilters } from '@/pages/products/components/smart-filters'
import { ProductCard } from '@/pages/products/components/product-card'
import { ProductListItem } from '@/pages/products/components/product-list-item'
import { MyProductCard } from '@/pages/products/components/my-product-card'
import { MyProductListItem } from '@/pages/products/components/my-product-list-item'
import { useTranslation } from 'react-i18next'
import { SearchX } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useDebounce } from '@/hooks/use-debounce'
import {
  ProductGridSkeleton,
  ProductListSkeleton,
  MyProductGridSkeleton,
  MyProductListSkeleton,
} from '@/pages/products/components/product-skeleton'
import { ROUTES } from '@/routes/paths'
import { PagePagination } from '@/components/page-pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchProducts,
  setPage,
  clearProducts,
  selectPaginationMetadata,
} from '@/redux/slices/products-slice'
import { mapProductsApiToUi } from '@/pages/products/utils/product-mappers'

export const ProductsPage = () => {
  useDocumentTitle('pages.products.title')
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<TViewMode>(
    () => (localStorage.getItem('viewMode') as TViewMode) || 'grid'
  )
  const [sortBy, setSortBy] = useState<string>('createdAt:desc')
  const isMobile = useIsMobile()
  const hasInitiallyFetched = useRef(false)

  const [activeTab, setActiveTab] = useState<TabMode>(() => {
    if (location.pathname.includes(ROUTES.PRODUCTS.MY)) {
      return 'purchased'
    }
    return 'available'
  })

  const [debouncedSearchQuery, clearDebounce, flushDebounce] = useDebounce(searchQuery, 2000)

  // Redux state
  const {
    products,
    isLoadingList: loading,
    errorList: error,
  } = useAppSelector(state => state.products)

  // Filter products locally based on active tab
  const productData = useMemo(() => {
    const filtered =
      activeTab === 'purchased' ? products.items.filter(p => p.isPurchased) : products.items
    return mapProductsApiToUi(filtered, i18n.language)
  }, [products.items, activeTab, i18n.language])

  const pagination = useMemo(
    () => selectPaginationMetadata(products.pagination),
    [products.pagination]
  )
  const filters = products.filters

  const isActuallyLoading = useMemo(() => {
    return loading && productData.length === 0
  }, [loading, productData.length])

  const searchLoading = useMemo(() => {
    return loading && debouncedSearchQuery.length > 0
  }, [loading, debouncedSearchQuery])

  // Load products - fetch all products once
  useEffect(() => {
    // Only fetch if cache is empty or filters/sorting changed
    const hasFiltersChanged = products.filters.search !== debouncedSearchQuery
    const hasSortingChanged = products.filters.sortBy !== sortBy
    const shouldFetch = products.isFetched && (hasFiltersChanged || hasSortingChanged)

    if (shouldFetch) {
      dispatch(
        fetchProducts({
          locale: i18n.language,
          search: debouncedSearchQuery || undefined,
          page: 1,
          limit: 50,
          sortBy: sortBy !== 'createdAt:desc' ? sortBy : undefined,
        })
      )
    }
  }, [
    dispatch,
    i18n.language,
    debouncedSearchQuery,
    sortBy,
    products.filters.sortBy,
    products.filters.search,
    products.isFetched,
  ])

  // Initial fetch: fetch all products once
  useEffect(() => {
    if (!hasInitiallyFetched.current && !products.isFetched) {
      dispatch(
        fetchProducts({
          locale: i18n.language,
          search: undefined,
          page: 1,
          limit: 50,
        })
      )
      hasInitiallyFetched.current = true
    }
  }, [dispatch, i18n.language, products.isFetched])

  // Fetch when page changes (pagination)
  useEffect(() => {
    // Only fetch if page is different from cached page and cache was already fetched
    if (products.isFetched && products.filters.page !== filters.page) {
      dispatch(
        fetchProducts({
          locale: i18n.language,
          search: debouncedSearchQuery || undefined,
          page: filters.page,
          limit: filters.limit,
          sortBy: sortBy !== 'createdAt:desc' ? sortBy : undefined,
        })
      )
    }
  }, [
    dispatch,
    i18n.language,
    debouncedSearchQuery,
    filters.page,
    filters.limit,
    sortBy,
    products.isFetched,
    products.filters.page,
  ])

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    let newTab: TabMode = 'available'
    if (location.pathname.includes(ROUTES.PRODUCTS.MY)) {
      newTab = 'purchased'
    }

    if (newTab !== activeTab) {
      setActiveTab(newTab)
    }
  }, [location.pathname, activeTab])

  // Reset page when search/sort changes
  useEffect(() => {
    dispatch(setPage(1))
  }, [dispatch, sortBy, debouncedSearchQuery])

  const handleTabChange = (tab: TabMode) => {
    setActiveTab(tab)

    let newPath: string = ROUTES.PRODUCTS.CATALOG
    if (tab === 'purchased') {
      newPath = ROUTES.PRODUCTS.MY
    }

    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true })
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSortBy('createdAt:desc')
    clearDebounce()
    dispatch(clearProducts())
    hasInitiallyFetched.current = false
  }

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderProducts = () => {
    const isAvailableTab = activeTab === 'available'
    const isGridView = viewMode === 'grid'
    const useAvailableStyle = isAvailableTab

    if (isActuallyLoading) {
      if (isGridView || isMobile) {
        return useAvailableStyle ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <MyProductGridSkeleton count={6} />
        )
      } else {
        return useAvailableStyle ? (
          <ProductListSkeleton count={6} />
        ) : (
          <MyProductListSkeleton count={6} />
        )
      }
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-16">
          <SearchX className="h-16 w-16 mb-4 text-red-400" />
          <h3 className="text-xl font-semibold mb-2 text-red-600">{t('pages.products.error')}</h3>
          <p className="text-sm">{error.includes('.') ? t(error) : error}</p>
          <button
            onClick={() =>
              dispatch(
                fetchProducts({
                  locale: i18n.language,
                })
              )
            }
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t('pages.products.retry')}
          </button>
        </div>
      )
    }

    if (productData.length === 0) {
      if (useAvailableStyle) {
        return (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-16">
            <SearchX className="h-16 w-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">{t('pages.products.noResults')}</h3>
            <p className="text-sm">{t('pages.products.noResultsHint')}</p>
          </div>
        )
      } else {
        return (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-16">
            <SearchX className="h-16 w-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              {t('pages.products.noPurchasedProducts')}
            </h3>
            <p className="text-sm">{t('pages.products.noPurchasedProductsHint')}</p>
          </div>
        )
      }
    }

    if (isGridView || isMobile) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData.map((product: IProductUi) =>
            useAvailableStyle ? (
              <ProductCard key={product.slug} {...product} />
            ) : (
              <MyProductCard key={product.slug} {...product} />
            )
          )}
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-4">
          {productData.map((product: IProductUi) =>
            useAvailableStyle ? (
              <ProductListItem key={product.slug} {...product} />
            ) : (
              <MyProductListItem key={product.slug} {...product} />
            )
          )}
        </div>
      )
    }
  }

  // Calculate counts for tabs from all cached products
  const availableCount = products.pagination ? products.pagination.total : products.items.length
  const purchasedCount = products.items.filter(p => p.isPurchased).length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
      <ProductTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        availableCount={availableCount}
        purchasedCount={purchasedCount}
      />
      <SmartFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalProducts={productData.length}
        tabMode={activeTab}
        onClearFilters={handleClearFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isLoading={isActuallyLoading}
        searchLoading={searchLoading}
        onSearchFlush={flushDebounce}
      />
      <div>{renderProducts()}</div>

      {pagination && pagination.totalPages > 1 && (
        <PagePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8 md:mt-16"
        />
      )}
    </div>
  )
}
