'use client'
import { useState } from 'react'
import Button from '@/components/button-v2/button'
import Input from '@/components/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import type { Department, StaffFormValues, AddStaffSheetProps } from '@/modules/staff/types/staff'

import { DEPARTMENT_OPTIONS, emptyForm } from '@/modules/staff/constants/staff'

// New staff accounts are always created with the base "STAFF" role — no
// role picker on this form. Promoting someone to Finance, Branch Manager,
// or Super Admin happens later via the staff Edit modal, which is
// restricted to users with staff:change_permission.
const DEFAULT_NEW_STAFF_ROLE = 'STAFF' as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddStaffSheet({ open, onOpenChange, onSave }: AddStaffSheetProps) {
  const [form, setForm] = useState<StaffFormValues>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormValues, string>>>({})

  const update = <K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const isFormComplete =
    !!form.department &&
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password !== '' &&
    form.confirmPassword !== ''

  const validate = () => {
    const next: Partial<Record<keyof StaffFormValues, string>> = {}
    if (!form.department) next.department = 'Select a department.'
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email.'
    }
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave?.({ ...form, role: DEFAULT_NEW_STAFF_ROLE })
    setForm(emptyForm)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Add Staff</SheetTitle>
          <SheetDescription className="sr-only">Form to add a new Staff member .</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 p-6">
            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={form.department}
                onValueChange={v => update('department', v as Department)}
              >
                <SelectTrigger
                  id="department"
                  aria-invalid={!!errors.department}
                  className="w-full"
                >
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-destructive text-sm">{errors.department}</p>}
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 space-y-2 border-t p-6 px-6 py-4">
          <Button variant="primary" size="full" onClick={handleSave} disabled={!isFormComplete}>
            Save
          </Button>

          <Button variant="outline" size="full" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
