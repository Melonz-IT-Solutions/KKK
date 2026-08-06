'use client'

import { useMemo, useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { UserPlus, Search, Pencil, ShieldCheck, Zap } from 'lucide-react'
import DepartmentBadge from '@/modules/staff/components/staff-v2-padge'
import { usePagination } from '@/lib/hooks/use-pagination'
import { paginate } from '@/lib/utils/paginate'
import Pagination from '@/components/pagenation/pagination'
import Button from '@/components/button'
import PageV2Header from '@/components/headers/page-v2-header'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  canManageStaffUsers,
  currentUser,
  isFinanceDepartment,
  isSuperAdmin,
} from '@/lib/data/current-user'

import type { StaffTableProps, StaffRow } from '@/modules/staff/types/staff'

interface StaffEditModalProps {
  staff: StaffRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staff: StaffRow & { newPassword?: string }) => void
}

function StaffEditModal({ staff, open, onOpenChange, onSave }: StaffEditModalProps) {
  const [status, setStatus] = useState(staff.status)
  const [role, setRole] = useState(staff.role)
  const [password, setPassword] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>Update staff permissions and status.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            {isSuperAdmin(currentUser) ? (
              <Select value={role} onValueChange={value => setRole(value as StaffRow['role'])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="SYSTEM_MANAGER">System Manager</SelectItem>
                  <SelectItem value="FINANCE">Finance</SelectItem>
                  <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                  <SelectItem value="STAFF_USER">Staff User</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {staff.role.replaceAll('_', ' ')}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={value => setStatus(value as StaffRow['status'])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSuperAdmin(currentUser) && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">Reset Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave({
                ...staff,
                role,
                status,
                ...(password ? { newPassword: password } : {}),
              })
              onOpenChange(false)
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function StaffTable({ data, onAddStaff }: StaffTableProps) {
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

  const canManageStaff = canManageStaffUsers(currentUser)
  const canAddStaff = canManageStaff && !isFinanceDepartment(currentUser)

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
              : isFinanceDepartment(currentUser)
                ? 'Import Staff'
                : 'View Only'}
          </Button>
          {!canAddStaff && (
            <p className="text-xs text-slate-500">
              {isFinanceDepartment(currentUser)
                ? 'Finance users can only import staff data.'
                : 'Branch managers can only view staff in their branch.'}
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
                    {isSuperAdmin(currentUser) ? (
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
                              await fetch('/api/staff', {
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
