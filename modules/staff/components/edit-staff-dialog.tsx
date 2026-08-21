'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import Button from '@/components/button-v2/button'

import { hasPermission } from '@/lib/auth/permissions'

import type { StaffRow, StaffUpdateValues } from '@/modules/staff/types/staff'

interface StaffEditDialogProps {
  staff: StaffRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staff: StaffUpdateValues) => Promise<void> | void
}

export function StaffEditDialog({ staff, open, onOpenChange, onSave }: StaffEditDialogProps) {
  const { data: session } = useSession()

  const [status, setStatus] = useState(staff.status)

  const [role, setRole] = useState(staff.role)

  const [password, setPassword] = useState('')

  const canEdit = session?.user
    ? hasPermission(session.user.role, 'staff:change_permission')
    : false

  const handleSave = async () => {
    await onSave({
      ...staff,
      role,
      status,
      ...(password ? { newPassword: password } : {}),
    })

    setPassword('')
    onOpenChange(false)
  }

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

            {canEdit ? (
              <Select value={role} onValueChange={value => setRole(value as StaffRow['role'])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FINANCE">Finance</SelectItem>

                  <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>

                  <SelectItem value="STAFF">Staff</SelectItem>
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

          {canEdit && (
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

          <Button type="button" onClick={() => void handleSave()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StaffEditDialog
