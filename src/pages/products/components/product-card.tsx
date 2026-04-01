import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DoorOpen } from 'lucide-react'
import { ImagePlaceholder } from '@/assets/image-placeholder'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { LocalizedPrice } from '@/components/localized-price'
import { getProductThumbnailUrl } from '@/utils/get-product-thumbnail-url'

interface IProductCardProps {
  slug: string
  title: string
  price: number
  purchased?: boolean
}

export function ProductCard({ slug, title, price, purchased = false }: IProductCardProps) {
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
    return purchased ? <DoorOpen className="w-4 h-4 mr-2" /> : null
  }

  return (
    <Card className="w-full flex flex-col p-0 overflow-hidden">
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
        <Link to={getProductLink()}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full object-cover" />
          )}
        </Link>
      </div>
      <div className="grow p-4 pb-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {purchased && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              {t('pages.products.product.purchased')}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="min-h-14 flex flex-col justify-end gap-2 text-sm p-4 pb-4"></CardContent>
      <CardFooter className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 pt-0 xl:pt-0">
        <div className="mb-4 xl:mb-0">
          <LocalizedPrice pricePLN={price} size="lg" showToggle={true} showDisclaimer={true} />
        </div>
        <Link to={getProductLink()} className="w-full xl:w-auto">
          <Button
            variant={purchased ? 'default' : 'outline'}
            className={`w-full xl:w-auto ml-auto ${purchased ? '' : 'bg-transparent'}`}
          >
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
