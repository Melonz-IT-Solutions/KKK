'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { UserPlus, Search, Pencil } from 'lucide-react'
import DepartmentBadge from '@/modules/staff/components/staff-table/staff-v2-badge'
import { usePagination } from '@/lib/hooks/use-pagination'
import { paginate } from '@/lib/utils/paginate'
import Pagination from '@/components/pagenation/pagination'
import Button from '@/components/button-v2/button'
import PageV2Header from '@/components/headers/page-v2-header'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  hasPermission,
} from '@/lib/auth/permissions'
import { StaffEditModal } from '@/modules/staff/components/staff-table/staff-edit-modal'

import type { StaffTableProps, StaffRow } from '@/modules/staff/types/staff'

export default function StaffTable({ data, onAddStaff }: StaffTableProps) {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<StaffRow | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const filtered = data.filter(
    row =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.department.toLowerCase().includes(search.toLowerCase())
  )

  const { page, pageSize, pageCount, start, end, setPage, setPageSize } = usePagination({
    totalItems: filtered.length,
    initialPageSize: 10,
  })

  const pageRows = paginate(filtered, start, end)

  const role = session?.user?.role
  const canAddStaff = role ? hasPermission(role, 'staff:create') : false
  const canEditStaff = role ? hasPermission(role, 'staff:change_permission') : false

  return (
    <div className="mx-auto w-full p-4">
      <PageV2Header title="Staff" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search User..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          />
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button onClick={onAddStaff} disabled={!canAddStaff}>
            <UserPlus className="h-4 w-4" />
            {canAddStaff
              ? 'Add Staff'
              : 'View Only'}
          </Button>
          {!canAddStaff && (
            <p className="text-xs text-slate-500">
              You do not have permission to add staff.
            </p>
          )}
        </div>
      </div>

      <div className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/60">
              <TableRow>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Department
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Email
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Role
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-400">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
              {pageRows.map(row => (
                <TableRow key={row.id} className="hover:bg-slate-50/70">
                  <TableCell>
                    <DepartmentBadge value={row.department} />
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{row.name}</TableCell>
                  <TableCell className="text-slate-600">{row.email}</TableCell>
                  <TableCell className="text-slate-600">{row.role.replaceAll('_', ' ')}</TableCell>
                  <TableCell className="text-slate-600">{row.status}</TableCell>
                  <TableCell className="text-primary text-right">
                    {canEditStaff ? (
                      <Dialog
                        open={isEditOpen && selectedStaff?.id === row.id}
                        onOpenChange={open => {
                          if (!open) setSelectedStaff(null)
                          setIsEditOpen(open)
                        }}
                      >
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setSelectedStaff(row)
                              setIsEditOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </DialogTrigger>

                        {selectedStaff?.id === row.id && (
                          <StaffEditModal
                            staff={selectedStaff}
                            open={isEditOpen}
                            onOpenChange={open => {
                              if (!open) setSelectedStaff(null)
                              setIsEditOpen(open)
                            }}
                            onSave={async updatedStaff => {
                              await fetch(`/api/staff/${updatedStaff.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  id: updatedStaff.id,
                                  role: updatedStaff.role,
                                  active: updatedStaff.status === 'ACTIVE',
                                  password: updatedStaff.newPassword,
                                }),
                              })
                            }}
                          />
                        )}
                      </Dialog>
                    ) : (
                      <span className="text-sm text-slate-400">View only</span>
                    )}
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
