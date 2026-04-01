import { Button } from '@/components/ui/button'
import { Users, Play } from 'lucide-react'
import { ImagePlaceholder } from '@/assets/image-placeholder'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/routes/paths'
import { getProductThumbnailUrl } from '@/utils/get-product-thumbnail-url'

interface IMyProductListItemProps {
  slug: string
  title: string
  participants?: number
}

export function MyProductListItem({ slug, title, participants }: IMyProductListItemProps) {
  const { t } = useTranslation()

  const thumbnailUrl = getProductThumbnailUrl({ productSlug: slug, fileName: 'cover' })

  return (
    <Card className="p-4">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <div className="relative shrink-0">
          <Link to={ROUTES.PRODUCTS.DETAILS(slug)}>
            <div className="group relative h-28 w-full overflow-hidden rounded-lg bg-muted md:w-48">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImagePlaceholder className="h-10 w-10" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="truncate leading-tight text-lg font-semibold">{title}</h3>
              </div>
            </div>
            <div className="w-full shrink-0 md:w-auto">
              <Button asChild className="w-full">
                <Link to={ROUTES.PRODUCTS.DETAILS(slug)}>
                  <Play className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4">
            {participants !== undefined && participants > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  <span className="md:hidden">{participants}</span>
                  <span className="hidden md:inline">
                    {t('pages.products.course.participants', {
                      count: participants,
                    })}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
