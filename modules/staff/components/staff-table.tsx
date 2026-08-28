'use client'

import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Pencil, SearchIcon, UserPlus, X } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import Button from '@/components/button-v2/button'
import PageV2Header from '@/components/headers/page-v2-header'

import Pagination from '@/components/pagenation/pagination'

import { usePagination } from '@/lib/hooks/use-pagination'
import { paginate } from '@/lib/utils/paginate'
import { hasPermission } from '@/lib/auth/permissions'

import DepartmentBadge from '@/modules/staff/components/department-badge'
import StaffEditDialog from '@/modules/staff/components/edit-staff-dialog'

import type { StaffRow, StaffTableProps } from '@/modules/staff/types/staff'

type StaffStatusFilter = 'active' | 'inactive' | 'all'

export default function StaffTable({ data, onAddStaff, onUpdateStaff }: StaffTableProps) {
  const { data: session } = useSession()

  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState('')

  const urlStatus = searchParams.get('status')

  const initialStatus: StaffStatusFilter =
    urlStatus === 'active' || urlStatus === 'inactive' ? urlStatus : 'all'

  const [statusFilter, setStatusFilter] = useState<StaffStatusFilter>(initialStatus)

  const [selectedStaff, setSelectedStaff] = useState<StaffRow | null>(null)

  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    const status = searchParams.get('status')

    if (status === 'active' || status === 'inactive') {
      setStatusFilter(status)
    } else {
      setStatusFilter('all')
    }
  }, [searchParams])

  const filtered = data.filter(row => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      row.name.toLowerCase().includes(searchValue) ||
      row.email.toLowerCase().includes(searchValue) ||
      row.department.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && row.status === 'ACTIVE') ||
      (statusFilter === 'inactive' && row.status === 'INACTIVE')

    return matchesSearch && matchesStatus
  })

  const { page, pageSize, pageCount, start, end, setPage, setPageSize } = usePagination({
    totalItems: filtered.length,
    initialPageSize: 10,
  })

  const pageRows = paginate(filtered, start, end)

  const role = session?.user?.role

  const canAddStaff = role ? hasPermission(role, 'staff:create') : false

  const canEditStaff = role ? hasPermission(role, 'staff:change_permission') : false

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setSearch('')
    setPage(1)

    router.push('/staff')
  }

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open)

    if (!open) {
      setSelectedStaff(null)
    }
  }

  return (
    <div className="mx-auto w-full p-4">
      <PageV2Header title="Staff" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <InputGroup className="h-10">
            <InputGroupInput
              placeholder="Search Staff..."
              value={search}
              onChange={event => handleSearchChange(event.target.value)}
            />

            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          {(statusFilter !== 'all' || search !== '') && (
            <Button
              variant="outline"
              className="bg-secondary hover:bg-primary rounded-sm border-gray-300 text-white hover:text-white"
              onClick={handleClearFilters}
            >
              <X className="text-destructive h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {canAddStaff && (
          <Button onClick={onAddStaff}>
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        )}
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
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaff(row)
                          setIsEditOpen(true)
                        }}
                        className="inline-flex items-center justify-center rounded-md p-1 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
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

      {selectedStaff && (
        <StaffEditDialog
          staff={selectedStaff}
          open={isEditOpen}
          onOpenChange={handleEditOpenChange}
          onSave={async updatedStaff => {
            await onUpdateStaff?.(updatedStaff)

            setIsEditOpen(false)
            setSelectedStaff(null)
          }}
        />
      )}
    </div>
  )
}
