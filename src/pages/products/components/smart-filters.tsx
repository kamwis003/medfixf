import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Grid3X3, List, X, Filter } from 'lucide-react'
import type { TViewMode, TabMode } from '../../../types/products'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks/use-mobile'

interface SmartFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: TViewMode
  onViewModeChange: (mode: TViewMode) => void
  totalProducts: number
  tabMode: TabMode
  onClearFilters: () => void
  sortBy: string
  onSortChange: (sort: string) => void
  isLoading?: boolean
  searchLoading?: boolean
  onSearchFlush?: () => void
}

export function SmartFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalProducts,
  tabMode,
  onClearFilters,
  sortBy,
  onSortChange,
  isLoading = false,
  searchLoading = false,
  onSearchFlush,
}: SmartFiltersProps) {
  const { t } = useTranslation()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const hasActiveFilters = searchQuery

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              tabMode === 'available'
                ? t('pages.products.filters.searchPlaceholderCatalog')
                : t('pages.products.filters.searchPlaceholderMyproducts')
            }
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && onSearchFlush) {
                onSearchFlush()
              }
            }}
            className="h-9 pl-10"
            disabled={searchLoading}
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        <div className="flex w-full items-center gap-2 sm:w-48">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex h-9 flex-1 items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{t('pages.products.filters.filters')}</span>
          </Button>

          {!isMobile && (
            <div className="flex shrink-0 items-center rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className="h-9 w-9 rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('list')}
                className="h-9 w-9 rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {t('pages.products.filters.activeFilters')}
          </span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              {t('pages.products.filters.search')} "{searchQuery}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-6 px-2 text-xs">
            {t('pages.products.filters.clearAll')}
          </Button>
        </div>
      )}
      {/* For future advanced filters as a base */}
      {/* {showAdvancedFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('pages.products.filters.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>
                {t('pages.products.filters.allCategories')}
              </SelectItem>
              {FILTER_CATEGORIES.map(({ value, emoji }) => (
                <SelectItem key={value} value={value}>
                  <span aria-label={`${emoji} ${t(`pages.products.filters.categories.${value}`)}`}>
                    {emoji} {t(`pages.products.filters.categories.${value}`)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )} */}
      <div className="flex items-center justify-between text-sm text-muted-foreground h-9">
        <span className="flex items-center gap-2">
          {isLoading && (
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          )}
          {totalProducts === 0 && !isLoading
            ? ''
            : t('pages.products.filters.results.found', {
                count: totalProducts,
              })}
        </span>
        {tabMode === 'available' && totalProducts !== 0 && (
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder={t('pages.products.filters.sort.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t('pages.products.filters.sort.name')}</SelectItem>
              <SelectItem value="popularity:desc">
                {t('pages.products.filters.sort.popular')}
              </SelectItem>
              <SelectItem value="priceCents:asc">
                {t('pages.products.filters.sort.priceLow')}
              </SelectItem>
              <SelectItem value="priceCents:desc">
                {t('pages.products.filters.sort.priceHigh')}
              </SelectItem>
              <SelectItem value="createdAt:desc">
                {t('pages.products.filters.sort.newest')}
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
