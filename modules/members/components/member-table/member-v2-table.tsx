'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { MEMBER_TABLE_COLUMNS } from '@/modules/members/constants/members'
import MembershipBadge from '@/modules/members/components/member-table/member-v2-membership'
import RowMenu from '@/modules/members/components/member-table/member-v2-rowmenu'
import Pagination from '@/components/pagenation/pagination'
import { usePagination } from '@/lib/hooks/use-pagination'

import type { MemberRow } from '@/modules/members/types/member'

interface MemberV2TableProps {
  data: MemberRow[]
}

export default function MemberV2Table({ data }: MemberV2TableProps) {
  const { page, pageSize, pageCount, start, end, setPage, setPageSize } = usePagination({
    totalItems: data.length,
    initialPageSize: 10,
  })

  const pageRows = data.slice(start, end)

  function handleAction(kind: 'view' | 'edit' | 'delete', row: MemberRow) {
    console.log(kind, row)
  }

  return (
    <div className="mx-auto w-full">
      <div className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                {MEMBER_TABLE_COLUMNS.map(col => (
                  <TableHead
                    key={col.key}
                    className="text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase"
                  >
                    <span className="inline-flex items-center gap-1">{col.label}</span>
                  </TableHead>
                ))}
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={MEMBER_TABLE_COLUMNS.length + 1}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
              {pageRows.map(row => (
                <TableRow key={row.id} className="hover:bg-slate-50/70">
                  <TableCell className="font-medium whitespace-nowrap text-slate-900">
                    {row.fullName}
                  </TableCell>
                  <TableCell>
                    <MembershipBadge value={row.membership} />
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{row.age}</TableCell>
                  <TableCell className="text-slate-600">{row.branch}</TableCell>
                  <TableCell className="text-slate-600">{row.civilStatus ?? ''}</TableCell>
                  <TableCell className="text-right">
                    <RowMenu
                      onView={() => handleAction('view', row)}
                      onEdit={() => handleAction('edit', row)}
                      onDelete={() => handleAction('delete', row)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}
