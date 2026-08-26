import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function DataPagination({
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const isFirst = page === 1
  const isLast = page === pageCount

  const navButtonClass = (disabled: boolean) =>
    cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer',
      disabled && 'opacity-40 pointer-events-none cursor-not-allowed hover:bg-transparent'
    )

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {[5, 10, 20, 50].map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="whitespace-nowrap">
        Page {page} of {pageCount}
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationLink
              onClick={() => !isFirst && onPageChange(1)}
              aria-label="First page"
              aria-disabled={isFirst}
              tabIndex={isFirst ? -1 : undefined}
              className={navButtonClass(isFirst)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => !isFirst && onPageChange(Math.max(1, page - 1))}
              aria-label="Previous page"
              aria-disabled={isFirst}
              tabIndex={isFirst ? -1 : undefined}
              className={navButtonClass(isFirst)}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => !isLast && onPageChange(Math.min(pageCount, page + 1))}
              aria-label="Next page"
              aria-disabled={isLast}
              tabIndex={isLast ? -1 : undefined}
              className={navButtonClass(isLast)}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => !isLast && onPageChange(pageCount)}
              aria-label="Last page"
              aria-disabled={isLast}
              tabIndex={isLast ? -1 : undefined}
              className={navButtonClass(isLast)}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
