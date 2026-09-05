'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import Button from '@/components/button-v2/button'

import { hasPermission } from '@/lib/auth/permissions'

import { BranchCombobox } from '@/modules/members/components/add-member/branch-combobox'
import { useClusters } from '@/modules/members/hooks/use-clusters'

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

  const [firstName, setFirstName] = useState(() => staff.name.split(' ')[0] ?? '')
  const [lastName, setLastName] = useState(() => staff.name.split(' ').slice(1).join(' '))
  const [username, setUsername] = useState(staff.username)
  const [email, setEmail] = useState(staff.email)
  const [status, setStatus] = useState(staff.status)
  const [role, setRole] = useState(staff.role)
  const [cluster, setCluster] = useState(staff.cluster ?? '')
  const [branch, setBranch] = useState(staff.branch ?? '')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([])

  const { clusters } = useClusters()

  const canEdit = session?.user
    ? hasPermission(session.user.role, 'staff:change_permission')
    : false

  // Reset form fields when the sheet opens with a (possibly different) staff
  useEffect(() => {
    if (open) {
      setFirstName(staff.name.split(' ')[0] ?? '')
      setLastName(staff.name.split(' ').slice(1).join(' '))
      setUsername(staff.username)
      setEmail(staff.email)
      setStatus(staff.status)
      setRole(staff.role)
      setCluster(staff.cluster ?? '')
      setBranch(staff.branch ?? '')
      setPassword('')
    }
  }, [open, staff])

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

  const handleRoleChange = (value: StaffRow['role']) => {
    setRole(value)
    setCluster('')
    setBranch('')
  }

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      await onSave({
        ...staff,
        firstName,
        lastName,
        username,
        email,
        role,
        status,
        cluster: role === 'CLUSTER_MANAGER' ? cluster : '',
        branch: role === 'BRANCH_MANAGER' ? branch : '',
        ...(password ? { newPassword: password } : {}),
      })

      setPassword('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save staff:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen && isSaving) return
        onOpenChange(nextOpen)
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Edit Staff</SheetTitle>

          <SheetDescription className="sr-only">Update role, status and password.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-firstName">First Name</Label>
              <Input
                id="edit-firstName"
                placeholder="First name"
                value={firstName}
                className="h-10"
                disabled={isSaving}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                placeholder="Last name"
                value={lastName}
                className="h-10"
                disabled={isSaving}
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                placeholder="Username"
                value={username}
                className="h-10"
                disabled={isSaving}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                className="h-10"
                disabled={isSaving}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label>Role</Label>

              {canEdit ? (
                <Select
                  value={role}
                  onValueChange={value => handleRoleChange(value as StaffRow['role'])}
                  disabled={isSaving}
                >
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

            {/* Cluster (Cluster Manager only) */}
            {role === 'CLUSTER_MANAGER' && (
              <div className="grid gap-2">
                <Label>Cluster</Label>

                <Select value={cluster} onValueChange={setCluster} disabled={isSaving}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cluster" />
                  </SelectTrigger>

                  <SelectContent>
                    {clusters.map(c => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Branch (Branch Manager only) */}
            {role === 'BRANCH_MANAGER' && (
              <div className="grid gap-2">
                <Label>Branch</Label>

                <BranchCombobox value={branch} onChange={setBranch} />
              </div>
            )}

            {/* Status */}
            <div className="grid gap-2">
              <Label>Status</Label>

              <Select
                value={status}
                onValueChange={value => setStatus(value as StaffRow['status'])}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Password */}
            {canEdit && (
              <div className="grid gap-2">
                <Label>Reset Password</Label>

                <Input
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={password}
                  className="h-10"
                  disabled={isSaving}
                  onChange={event => setPassword(event.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 space-y-2 border-t p-6 px-6 py-4">
          <Button
            variant="primary"
            size="full"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="outline"
            size="full"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default StaffEditDialog
