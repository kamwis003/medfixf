import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Box, Layers } from 'lucide-react'
import type { TabMode } from '@/types/products'
import { useTranslation } from 'react-i18next'

interface IProductTabsProps {
  activeTab: TabMode
  onTabChange: (tab: TabMode) => void
  availableCount: number
  purchasedCount: number
}

export function ProductTabs({
  activeTab,
  onTabChange,
  availableCount,
  purchasedCount,
}: IProductTabsProps) {
  const { t } = useTranslation()

  return (
    <Tabs
      defaultValue="available"
      value={activeTab}
      onValueChange={value => onTabChange(value as TabMode)}
      className="w-full"
    >
      <div className="flex justify-center">
        <TabsList className="grid h-12 w-full grid-cols-2 bg-muted sm:w-auto">
          <TabsTrigger
            value="available"
            className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">{t('pages.products.tabs.catalog')}</span>
            <span className="sm:hidden">{t('pages.products.tabs.catalog_short')}</span>
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              {availableCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="purchased"
            className="flex items-center gap-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">{t('pages.products.tabs.my_learning')}</span>
            <span className="sm:hidden">{t('pages.products.tabs.my_learning_short')}</span>
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              {purchasedCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  )
}
