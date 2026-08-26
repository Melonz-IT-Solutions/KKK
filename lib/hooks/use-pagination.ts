import { useMemo, useState } from 'react'

interface UsePaginationOptions {
  totalItems: number
  initialPageSize?: number
  initialPage?: number
}

export function usePagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
}: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  )

  const clampedPage = Math.min(page, pageCount)
  const start = (clampedPage - 1) * pageSize
  const end = start + pageSize

  function changePageSize(size: number) {
    setPageSize(size)
    setPage(1) // reset to first page whenever size changes
  }

  return {
    page: clampedPage,
    pageSize,
    pageCount,
    start,
    end,
    setPage,
    setPageSize: changePageSize,
  }
}
