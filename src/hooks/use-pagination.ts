import { useMemo } from 'react'

interface IPaginationMetadata {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface IUsePaginationProps {
  pagination: IPaginationMetadata | null
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

interface IUsePaginationReturn {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  visiblePages: number[]
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  isPageVisible: (page: number) => boolean
  shouldShowEllipsisStart: boolean
  shouldShowEllipsisEnd: boolean
}

export const usePagination = ({
  pagination,
  onPageChange,
  maxVisiblePages = 5,
}: IUsePaginationProps): IUsePaginationReturn => {
  const currentPage = pagination?.page || 1
  const totalPages = pagination?.totalPages || 1
  const totalItems = pagination?.totalItems || 0
  const hasNextPage = pagination?.hasNextPage || false
  const hasPreviousPage = pagination?.hasPreviousPage || false

  const visiblePages = useMemo(() => {
    if (!pagination || totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    const end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [pagination, currentPage, totalPages, maxVisiblePages])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1)
    }
  }

  const goToFirstPage = () => {
    goToPage(1)
  }

  const goToLastPage = () => {
    goToPage(totalPages)
  }

  const isPageVisible = (page: number) => {
    return visiblePages.includes(page)
  }

  const shouldShowEllipsisStart = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[0] > 1
  }, [visiblePages])

  const shouldShowEllipsisEnd = useMemo(() => {
    return visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < totalPages
  }, [visiblePages, totalPages])

  return {
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    visiblePages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    isPageVisible,
    shouldShowEllipsisStart,
    shouldShowEllipsisEnd,
  }
}
