'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { Skeleton } from '@/components/ui/skeleton'

import { MEMBER_TABLE_COLUMNS } from '@/modules/members/constants/members'

import MembershipBadge from '@/modules/members/components/member-table/membership-badge'
import RowMenu from '@/modules/members/components/member-table/row-menu'

import Pagination from '@/components/pagenation/pagination'

import { useMemberTable } from '@/modules/members/hooks/use-member-table'

import type { MemberV2TableProps } from '@/modules/members/types/member'

import { getMemberFullName } from '@/modules/members/utils/member-table'

export default function MemberTable({ data, loading, onDeleted, onEdit }: MemberV2TableProps) {
  const {
    deleteMember,
    deleting,
    page,
    pageSize,
    pageCount,
    pageRows,
    setDeleteMember,
    setPage,
    setPageSize,
    handleAction,
    confirmDelete,
  } = useMemberTable({
    data,
    onDeleted,
    onEdit,
  })

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
              {loading && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {MEMBER_TABLE_COLUMNS.map(col => (
                        <TableCell key={col.key}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Skeleton className="h-4 w-6 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!loading && pageRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={MEMBER_TABLE_COLUMNS.length + 1}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}

              {!loading && pageRows.map(row => (
                <TableRow key={row.id} className="hover:bg-slate-50/70">
                  <TableCell className="font-medium whitespace-nowrap text-slate-900 uppercase">
                    {getMemberFullName(row)}
                  </TableCell>

                  <TableCell>
                    <MembershipBadge value={row.membership} />
                  </TableCell>

                  <TableCell className="font-medium text-slate-700">{row.age}</TableCell>

                  <TableCell className="text-slate-600 uppercase">{row.branch ?? ''}</TableCell>

                  <TableCell className="text-slate-600 uppercase">
                    {row.civilStatus ?? ''}
                  </TableCell>

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

      <AlertDialog
        open={!!deleteMember}
        onOpenChange={open => {
          if (!open && !deleting) {
            setDeleteMember(null)
          }
        }}
      >
        <AlertDialogContent className="border-green-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">Set Member As Inactive</AlertDialogTitle>

            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to set{' '}
              <span className="text-primary font-semibold">
                {deleteMember ? getMemberFullName(deleteMember) : ''}
              </span>{' '}
              as an inactive from the member list?
              <br />
              <span className="mt-2 block text-sm text-slate-500">
                The member will not be permanently deleted. You can keep the information in the
                database while removing it from the active list.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={confirmDelete} disabled={deleting} className="text-white">
              {deleting ? 'Loading...' : 'Yes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
