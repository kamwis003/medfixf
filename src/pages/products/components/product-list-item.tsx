import { Badge } from '@/components/ui/badge'
import { ImageIcon, Play, DoorOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/routes/paths'
import { LocalizedPrice } from '@/components/localized-price'
import { getProductThumbnailUrl } from '@/utils/get-product-thumbnail-url'

interface ProductListItemProps {
  slug: string
  title: string
  price: number
  purchased?: boolean
}

export function ProductListItem({ slug, title, price, purchased = false }: ProductListItemProps) {
  const { t } = useTranslation()
  const thumbnailUrl = getProductThumbnailUrl({ productSlug: slug, fileName: 'cover' })

  const getProductLink = () => {
    return purchased ? ROUTES.PRODUCTS.MY_DETAILS(slug) : ROUTES.PRODUCTS.DETAILS(slug)
  }

  const getButtonText = () => {
    if (purchased) {
      return t('pages.products.product.enterProduct')
    }
    return t('pages.products.product.checkMoreInfo')
  }

  const getButtonIcon = () => {
    return purchased ? <Play className="h-4 w-4 mr-2" /> : null
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <div className="relative shrink-0">
          <Link to={getProductLink()}>
            <div className="group relative h-28 w-full overflow-hidden rounded-lg bg-muted lg:w-48">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity group-hover:opacity-100">
                <DoorOpen className="h-8 w-8 text-white" fill="white" />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="mb-2 flex flex-col items-start justify-between gap-4 lg:flex-row">
            <div className="min-w-0 flex-1">
              <h3 className="truncate leading-tight text-lg font-semibold mb-2">{title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {purchased && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    {t('pages.products.product.purchased')}
                  </Badge>
                )}
              </div>
            </div>
            <div className="w-full shrink-0 lg:w-auto lg:text-right space-y-2">
              <div className="lg:mb-3">
                <LocalizedPrice
                  pricePLN={price}
                  size="lg"
                  showToggle={true}
                  showDisclaimer={true}
                />
              </div>
              <Button asChild className="w-full" variant={purchased ? 'default' : 'outline'}>
                <Link to={getProductLink()}>
                  {getButtonIcon()}
                  {getButtonText()}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4"></div>
        </div>
      </div>
    </Card>
  )
}
