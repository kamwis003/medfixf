import { Skeleton } from '@/components/ui/skeleton'

export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <Skeleton className="h-48 w-full rounded-md mb-4" />

        <Skeleton className="h-6 w-3/4 mb-2" />

        <Skeleton className="h-4 w-1/2 mb-3" />

        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}

export const ProductListItemSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card">
      <Skeleton className="h-24 w-32 rounded-md shrink-0" />

      <div className="flex-1 min-w-0">
        <Skeleton className="h-6 w-3/4 mb-2" />

        <Skeleton className="h-4 w-1/2 mb-3" />

        <div className="space-y-1 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

export const MyProductCardSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <Skeleton className="h-48 w-full rounded-md mb-4" />

        <Skeleton className="h-6 w-3/4 mb-2" />

        <Skeleton className="h-4 w-1/2 mb-3" />

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <Skeleton className="h-4 w-2/3 mb-4" />

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}

export const MyProductListItemSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card">
      <Skeleton className="h-24 w-32 rounded-md shrink-0" />

      <div className="flex-1 min-w-0">
        <Skeleton className="h-6 w-3/4 mb-2" />

        <Skeleton className="h-4 w-1/2 mb-3" />

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="h-9 w-24" />
    </div>
  )
}

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export const ProductListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductListItemSkeleton key={index} />
      ))}
    </div>
  )
}

export const MyProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <MyProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export const MyProductListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <MyProductListItemSkeleton key={index} />
      ))}
    </div>
  )
}
