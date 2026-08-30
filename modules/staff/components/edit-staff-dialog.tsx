'use client'

import { useEffect, useState } from 'react'
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

interface RoleOption {
  name: string
  label: string
}

export function StaffEditDialog({ staff, open, onOpenChange, onSave }: StaffEditDialogProps) {
  const { data: session } = useSession()

  const [status, setStatus] = useState(staff.status)

  const [role, setRole] = useState(staff.role)

  const [password, setPassword] = useState('')

  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([])

  const canEdit = session?.user
    ? hasPermission(session.user.role, 'staff:change_permission')
    : false

  useEffect(() => {
    if (!open || !canEdit) {
      return
    }

    fetch('/api/staff/departments', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()

        if (!response.ok || !Array.isArray(data.roles)) {
          throw new Error(data.message ?? 'Failed to load roles')
        }

        return data.roles as RoleOption[]
      })
      .then(setRoleOptions)
      .catch(error => {
        console.error('Failed to load roles:', error)
      })
  }, [open, canEdit])

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

          <DialogDescription>Update Role, Status & Password.</DialogDescription>
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
                  {roleOptions.map(option => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.label}
                    </SelectItem>
                  ))}
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
                className="h-10"
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
