'use client'

import { useEffect, useState } from 'react'

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

import type { StaffFormValues, AddStaffSheetProps } from '@/modules/staff/types/staff'

import { EMPTY_STAFF_FORM } from '@/modules/staff/data/staff-options'

import { BranchCombobox } from '@/modules/members/components/add-member/branch-combobox'
import { useClusters } from '@/modules/members/hooks/use-clusters'

interface DepartmentOption {
  name: StaffFormValues['role']
  label: string
}

export function AddStaffSheet({ open, onOpenChange, onSave }: AddStaffSheetProps) {
  const [form, setForm] = useState<StaffFormValues>(EMPTY_STAFF_FORM)

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormValues, string>>>({})

  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>([])

  const { clusters } = useClusters()

  useEffect(() => {
    if (!open) {
      return
    }

    fetch('/api/staff/departments', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()

        if (!response.ok || !Array.isArray(data.roles)) {
          throw new Error(data.message ?? 'Failed to load departments')
        }

        return data.roles as DepartmentOption[]
      })
      .then(setDepartmentOptions)
      .catch(error => {
        console.error('Failed to load departments:', error)
      })
  }, [open])

  // ---------------------------------------------------------------------------
  // Saving state
  // ---------------------------------------------------------------------------

  const [isSaving, setIsSaving] = useState(false)

  // ---------------------------------------------------------------------------
  // Update field
  // ---------------------------------------------------------------------------

  const update = <K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }))

    setErrors(prev => ({
      ...prev,
      [key]: undefined,
    }))
  }

  // ---------------------------------------------------------------------------
  // Department change
  // ---------------------------------------------------------------------------

  const handleDepartmentChange = (roleName: string) => {
    const option = departmentOptions.find(item => item.name === roleName)

    if (!option) {
      return
    }

    setForm(prev => ({
      ...prev,
      department: option.label,
      role: option.name,
      branch: '',
      cluster: '',
    }))

    setErrors(prev => ({
      ...prev,
      department: undefined,
      role: undefined,
      branch: undefined,
      cluster: undefined,
    }))
  }

  // ---------------------------------------------------------------------------
  // Form completeness
  // ---------------------------------------------------------------------------

  const isFormComplete =
    form.username.trim() !== '' &&
    !!form.department &&
    !!form.role &&
    (form.role !== 'CLUSTER_MANAGER' || !!form.cluster) &&
    (form.role !== 'BRANCH_MANAGER' || !!form.branch) &&
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password !== '' &&
    form.confirmPassword !== ''

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validate = () => {
    const next: Partial<Record<keyof StaffFormValues, string>> = {}

    if (!form.username.trim()) {
      next.username = 'Username is required.'
    }

    if (!form.department) {
      next.department = 'Select a department.'
    }

    if (!form.role) {
      next.role = 'A role could not be determined from the department.'
    }

    if (form.role === 'CLUSTER_MANAGER' && !form.cluster) {
      next.cluster = 'Select a cluster.'
    }

    if (form.role === 'BRANCH_MANAGER' && !form.branch) {
      next.branch = 'Select a branch.'
    }

    if (!form.name.trim()) {
      next.name = 'Name is required.'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email.'
    }

    if (!form.password) {
      next.password = 'Password is required.'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Confirm your password.'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match.'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------

  const handleSave = async () => {
    /**
     * IMPORTANT:
     *
     * This guard prevents a second click while the
     * first save request is still running.
     */
    if (isSaving) {
      return
    }

    /**
     * Validate before starting the saving state.
     */
    if (!validate()) {
      return
    }

    /**
     * Lock the Save button immediately.
     */
    setIsSaving(true)

    try {
      await onSave?.({
        ...form,
        branch: form.role === 'BRANCH_MANAGER' ? form.branch : '',
        cluster: form.role === 'CLUSTER_MANAGER' ? form.cluster : '',
      })

      /**
       * Only reset and close after the save
       * successfully finishes.
       */
      setForm(EMPTY_STAFF_FORM)
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save staff:', error)
    } finally {
      /**
       * Always unlock the form.
       *
       * This also handles API errors.
       */
      setIsSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    /**
     * Do not allow the user to cancel while
     * the API request is still running.
     */
    if (isSaving) {
      return
    }

    setForm(EMPTY_STAFF_FORM)
    setErrors({})
    onOpenChange(false)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Sheet
      open={open}
      onOpenChange={nextOpen => {
        /**
         * Prevent closing the Sheet while saving.
         */
        if (!nextOpen && isSaving) {
          return
        }

        onOpenChange(nextOpen)
      }}
    >
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="text-xl font-semibold">Add Staff</SheetTitle>

          <SheetDescription className="sr-only">Form to add a new staff member.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>

              <Select value={form.role} onValueChange={handleDepartmentChange} disabled={isSaving}>
                <SelectTrigger
                  id="department"
                  aria-invalid={!!errors.department}
                  className="w-full"
                >
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent>
                  {departmentOptions.map(option => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.department && <p className="text-destructive text-sm">{errors.department}</p>}
            </div>

            {/* Cluster (Cluster Manager only) */}
            {form.role === 'CLUSTER_MANAGER' && (
              <div className="grid gap-2">
                <Label htmlFor="cluster">Cluster</Label>

                <Select
                  value={form.cluster}
                  onValueChange={value => update('cluster', value)}
                  disabled={isSaving}
                >
                  <SelectTrigger id="cluster" aria-invalid={!!errors.cluster} className="w-full">
                    <SelectValue placeholder="Select Cluster" />
                  </SelectTrigger>

                  <SelectContent>
                    {clusters.map(cluster => (
                      <SelectItem key={cluster.id} value={cluster.name}>
                        {cluster.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.cluster && <p className="text-destructive text-sm">{errors.cluster}</p>}
              </div>
            )}

            {/* Branch (Branch Manager only) */}
            {form.role === 'BRANCH_MANAGER' && (
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>

                <BranchCombobox
                  id="branch"
                  value={form.branch}
                  onChange={value => update('branch', value)}
                  invalid={!!errors.branch}
                />

                {errors.branch && <p className="text-destructive text-sm">{errors.branch}</p>}
              </div>
            )}

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                placeholder="Username"
                value={form.username}
                onChange={event => {
                  const value = event.target.value.toLowerCase()

                  // Only allow letters, no spaces or special characters
                  if (/^[a-z]*$/.test(value)) {
                    update('username', value)
                  }
                }}
                aria-invalid={!!errors.username}
                disabled={isSaving}
              />

              {errors.username && <p className="text-destructive text-sm">{errors.username}</p>}
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                placeholder="Full name"
                value={form.name}
                onChange={event => update('name', event.target.value)}
                aria-invalid={!!errors.name}
                disabled={isSaving}
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
                onChange={event => update('email', event.target.value)}
                aria-invalid={!!errors.email}
                disabled={isSaving}
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
                onChange={event => update('password', event.target.value)}
                aria-invalid={!!errors.password}
                disabled={isSaving}
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
                onChange={event => update('confirmPassword', event.target.value)}
                aria-invalid={!!errors.confirmPassword}
                disabled={isSaving}
              />

              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 space-y-2 border-t p-6 px-6 py-4">
          <Button
            variant="primary"
            size="full"
            onClick={() => void handleSave()}
            disabled={!isFormComplete || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <Button variant="outline" size="full" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddStaffSheet
