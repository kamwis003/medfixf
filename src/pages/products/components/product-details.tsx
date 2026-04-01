import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'
import type { IProductUi } from '@/types/product-ui'
import { useTranslation } from 'react-i18next'
import { StripeCheckoutButton } from '@/components/stripe-checkout-button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { LocalizedPrice } from '@/components/localized-price'
import { getProductThumbnailUrl } from '@/utils/get-product-thumbnail-url'

interface IProductDetailsProps {
  product: IProductUi
}

export function ProductDetails({ product }: IProductDetailsProps) {
  const { t } = useTranslation()
  const thumbnailUrl = getProductThumbnailUrl({ productSlug: product.slug, fileName: 'cover' })

  // Stripe checkout payload using stripePriceId
  const checkoutPayload = {
    priceId: product.stripePriceId,
    productSlugs: [product.slug],
  }

  return (
    <div className="bg-background">
      <section className="bg-card rounded-lg shadow-sm p-6 xl:p-8 mb-8">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">
          <div className="relative w-full xl:w-2/5 h-40 xl:h-70 overflow-hidden rounded-lg shrink-0">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                <Video className="w-16 h-16" />
              </div>
            )}
          </div>
          <div className="grow">
            <h1 className="text-2xl xl:text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
              <LocalizedPrice
                pricePLN={product.price}
                size="xl"
                showToggle={true}
                showDisclaimer={true}
              />
              {product.purchased ? (
                <Link to={ROUTES.PRODUCTS.MY_DETAILS(product.slug)} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('pages.products.product.enterProduct')}
                  </Button>
                </Link>
              ) : (
                <StripeCheckoutButton
                  payload={checkoutPayload}
                  label={t('pages.products.product.buyNow')}
                  className="w-full sm:w-auto"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {product.description && product.description.trim() && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">{t('pages.products.product.aboutProduct')}</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </section>
      )}
    </div>
  )
}
