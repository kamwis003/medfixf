import type { IProductApi } from '@/types/product-api'
import type { IProductUi } from '@/types/product-ui'

/**
 * Get localized text from translation map with fallback
 */
export function getLocalizedText(
  translations: Record<string, string>,
  locale: string,
  fallbackLocale: string = 'pl'
): string {
  return translations[locale] || translations[fallbackLocale] || ''
}

/**
 * Transform API product to UI-friendly format
 */
export function mapProductApiToUi(product: IProductApi, locale: string): IProductUi {
  return {
    slug: product.slug,
    title: getLocalizedText(product.nameTranslations, locale),
    description: getLocalizedText(product.descriptionTranslations, locale),
    price: product.price,
    purchased: product.isPurchased,
    stripePriceId: product.stripePriceId,
    stripeProductId: product.stripeProductId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

/**
 * Transform array of API products to UI format
 */
export function mapProductsApiToUi(products: IProductApi[], locale: string): IProductUi[] {
  return products.map(product => mapProductApiToUi(product, locale))
}
