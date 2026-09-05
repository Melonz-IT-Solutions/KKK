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

  const [isSaving, setIsSaving] = useState(false)

  const update = <K extends keyof StaffFormValues>(key: K, value: StaffFormValues[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const handleDepartmentChange = (roleName: string) => {
    const option = departmentOptions.find(item => item.name === roleName)

    if (!option) return

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

  const isFormComplete =
    form.username.trim() !== '' &&
    !!form.department &&
    !!form.role &&
    (form.role !== 'CLUSTER_MANAGER' || !!form.cluster) &&
    (form.role !== 'BRANCH_MANAGER' || !!form.branch) &&
    form.clientId.trim() !== '' &&
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.trim() !== ''

  const validate = () => {
    const next: Partial<Record<keyof StaffFormValues, string>> = {}

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

    if (!form.username.trim()) {
      next.username = 'Username is required.'
    }

    if (!form.clientId.trim()) {
      next.clientId = 'Client ID is required.'
    }

    if (!form.firstName.trim()) {
      next.firstName = 'First name is required.'
    }

    if (!form.lastName.trim()) {
      next.lastName = 'Last name is required.'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email.'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (isSaving) return

    if (!validate()) return

    setIsSaving(true)

    try {
      await onSave?.({
        ...form,
        branch: form.role === 'BRANCH_MANAGER' ? form.branch : '',
        cluster: form.role === 'CLUSTER_MANAGER' ? form.cluster : '',
      })

      setForm(EMPTY_STAFF_FORM)
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save staff:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (isSaving) return
    setForm(EMPTY_STAFF_FORM)
    setErrors({})
    onOpenChange(false)
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
          <SheetTitle className="text-xl font-semibold">Add Staff</SheetTitle>
          <SheetDescription className="sr-only">Form to add a new staff member.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>

              <Select value={form.role} onValueChange={handleDepartmentChange} disabled={isSaving}>
                <SelectTrigger id="department" aria-invalid={!!errors.department} className="w-full">
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
                onChange={e => {
                  const value = e.target.value.toLowerCase()
                  if (/^[a-z]*$/.test(value)) {
                    update('username', value)
                  }
                }}
                aria-invalid={!!errors.username}
                disabled={isSaving}
              />

              {errors.username && <p className="text-destructive text-sm">{errors.username}</p>}
            </div>

            {/* Client ID */}
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client ID</Label>

              <Input
                id="clientId"
                placeholder="Client ID"
                value={form.clientId}
                onChange={e => update('clientId', e.target.value)}
                aria-invalid={!!errors.clientId}
                disabled={isSaving}
              />

              {errors.clientId && <p className="text-destructive text-sm">{errors.clientId}</p>}
            </div>

            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>

              <Input
                id="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={e => update('firstName', e.target.value)}
                aria-invalid={!!errors.firstName}
                disabled={isSaving}
              />

              {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>

              <Input
                id="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={e => update('lastName', e.target.value)}
                aria-invalid={!!errors.lastName}
                disabled={isSaving}
              />

              {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
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
                disabled={isSaving}
              />

              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            {/* Password — hidden, generated automatically as lastName + clientId */}
            {/* <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                aria-invalid={!!errors.password}
                disabled={isSaving}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div> */}

            {/* Confirm Password — hidden, generated automatically */}
            {/* <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                aria-invalid={!!errors.confirmPassword}
                disabled={isSaving}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t px-6 py-4">
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
