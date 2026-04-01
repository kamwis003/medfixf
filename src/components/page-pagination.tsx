import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface IPaginationMetadata {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface IPagePaginationProps {
  pagination: IPaginationMetadata | null
  onPageChange: (page: number) => void
  className?: string
}

const PaginationPreviousTranslated = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">{t('pagination.previous')}</span>
    </PaginationLink>
  )
}

const PaginationNextTranslated = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { t } = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">{t('pagination.next')}</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

export const PagePagination = ({
  pagination,
  onPageChange,
  className = '',
}: IPagePaginationProps) => {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    visiblePages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    shouldShowEllipsisStart,
    shouldShowEllipsisEnd,
  } = usePagination({
    pagination,
    onPageChange,
    maxVisiblePages: 5,
  })

  if (!pagination || totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPreviousTranslated
              href="#"
              onClick={e => {
                e.preventDefault()
                goToPreviousPage()
              }}
              className={!hasPreviousPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {shouldShowEllipsisStart && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    goToPage(1)
                  }}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {visiblePages.map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={e => {
                  e.preventDefault()
                  goToPage(page)
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {shouldShowEllipsisEnd && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    goToPage(totalPages)
                  }}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNextTranslated
              href="#"
              onClick={e => {
                e.preventDefault()
                goToNextPage()
              }}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
