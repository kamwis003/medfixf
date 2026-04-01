import { useParams, useNavigate } from 'react-router-dom'
import { ProductDetails } from './components/product-details'
import { NotFound } from '@/pages/not-found'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/routes/paths'
import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchProductBySlug } from '@/redux/slices/products-slice'
import { mapProductApiToUi } from '@/pages/products/utils/product-mappers'
import type { IProductUi } from '@/types/product-ui'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()

  const {
    currentBySlug,
    isLoadingDetails: loading,
    errorDetails: error,
  } = useAppSelector(state => state.products)

  const productApi = slug ? currentBySlug[slug] : null
  const product: IProductUi | null = useMemo(
    () => (productApi ? mapProductApiToUi(productApi, i18n.language) : null),
    [productApi, i18n.language]
  )

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug({ slug }))
    }
  }, [dispatch, slug])

  const productTitle = product?.title?.trim() ?? ''

  useEffect(() => {
    const appName = t('app.name')
    if (loading) {
      document.title = `${t('pages.products.product.documentTitleLoading')} | ${appName}`
    } else if (productTitle) {
      document.title = `${productTitle} | ${appName}`
    } else {
      document.title = `${t('pages.products.product.title')} | ${appName}`
    }
  }, [productTitle, loading, t])

  if (loading) {
    return (
      <div className="space-y-8 p-4 pt-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(ROUTES.PRODUCTS.CATALOG)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pages.products.product.backToCatalog')}
          </Button>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8 p-4 pt-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(ROUTES.PRODUCTS.CATALOG)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pages.products.product.backToCatalog')}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive">{t('common.error')}</h2>
            <p className="text-muted-foreground mt-2">
              {error === 'Product not found'
                ? t('pages.products.product.notFound')
                : error.includes('.') || error.includes('_')
                  ? t(error)
                  : error}
            </p>
          </div>
          <Button onClick={() => navigate(ROUTES.PRODUCTS.CATALOG)}>
            {t('pages.products.product.backToCatalog')}
          </Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return <NotFound />
  }

  return (
    <div className="space-y-8 p-4 pt-6">
      <div className="flex items-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate(ROUTES.PRODUCTS.CATALOG)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('pages.products.product.backToCatalog')}
        </Button>
      </div>
      <ProductDetails product={product} />
    </div>
  )
}
