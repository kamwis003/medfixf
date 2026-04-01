import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DoorOpen } from 'lucide-react'
import { ImagePlaceholder } from '@/assets/image-placeholder'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getProductThumbnailUrl } from '@/utils/get-product-thumbnail-url'
import { ROUTES } from '@/routes/paths'

interface MyProductCardProps {
  slug: string
  title: string
}

export function MyProductCard({ slug, title }: MyProductCardProps) {
  const { t } = useTranslation()
  const thumbnailUrl = getProductThumbnailUrl({ productSlug: slug, fileName: 'cover' })

  return (
    <Card className="w-full flex flex-col p-0 overflow-hidden">
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <ImagePlaceholder className="w-full h-full object-cover" />
        )}
      </div>
      <div className="grow p-4 pb-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
        </div>
      </div>
      <CardContent className="min-h-14 flex flex-col justify-end gap-2 text-sm p-4 pb-4"></CardContent>
      <CardFooter className="flex flex-col gap-4 p-4">
        <div className="w-full"></div>
        <Button className="w-full" type="button" asChild>
          <Link to={ROUTES.PRODUCTS.MY_DETAILS(slug)}>
            <DoorOpen className="w-4 h-4 mr-2" />
            {t('pages.products.product.enterProduct')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
