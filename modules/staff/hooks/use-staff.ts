'use client'

import { useCallback, useEffect, useState } from 'react'

import type { StaffFormValues, StaffRow, StaffUpdateValues } from '@/modules/staff/types/staff'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

export function useStaff() {
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadStaff = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/staff?pageSize=1000', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to load staff')
      }

      setStaff(data.items ?? [])
    } catch (error) {
      console.error('Failed to load staff:', error)

      setStaff([])

      showErrorToast(error instanceof Error ? error.message : 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }, [])

  const addStaff = useCallback(
    async (values: StaffFormValues) => {
      try {
        const response = await fetch('/api/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            branch: values.branch || undefined,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message ?? 'Failed to add staff')
        }

        await loadStaff()

        showSuccessToast('Successfully added a new staff')
      } catch (error) {
        showErrorToast(error instanceof Error ? error.message : 'Failed to add staff')

        throw error
      }
    },
    [loadStaff]
  )

  const updateStaff = useCallback(
    async (values: StaffUpdateValues) => {
      try {
        const response = await fetch(`/api/staff/${values.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: values.id,
            role: values.role,
            active: values.status === 'ACTIVE',
            password: values.newPassword || undefined,
          }),
        })

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message ?? 'Failed to update staff')
        }

        await loadStaff()

        showSuccessToast('Staff updated successfully.')
      } catch (error) {
        console.error('Failed to update staff:', error)

        showErrorToast(error instanceof Error ? error.message : 'Failed to update staff')

        throw error
      }
    },
    [loadStaff]
  )

  useEffect(() => {
    void loadStaff()
  }, [loadStaff])

  return {
    staff,
    loading,
    loadStaff,
    addStaff,
    updateStaff,
  }
}
