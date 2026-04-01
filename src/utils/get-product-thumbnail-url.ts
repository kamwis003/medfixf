import { VITE_SUPABASE_URL } from '@/configuration/env'

export type TThumbnailExt = 'jpg' | 'png' | 'webp'

interface IGetProductThumbnailUrlParams {
  productSlug: string
  fileName: string // without extension
  ext?: TThumbnailExt
}

function normalizePathSegment(value: string) {
  return encodeURIComponent(value.trim().replace(/^\/+|\/+$/g, ''))
}

export function getProductThumbnailUrl({
  productSlug,
  fileName,
  ext = 'webp',
}: IGetProductThumbnailUrlParams) {
  const slug = normalizePathSegment(productSlug)
  const name = normalizePathSegment(fileName)

  return `${VITE_SUPABASE_URL}/storage/v1/object/public/thumbnails/products/${slug}/${name}.${ext}`
}
