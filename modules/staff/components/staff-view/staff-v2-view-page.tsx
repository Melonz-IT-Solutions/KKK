'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import StaffTable from '@/modules/staff/components/staff-table/staff-v2-table'
import { AddStaffSheet } from '@/modules/staff/components/staff-add/staff-v2-addstaff'
import type { StaffRow, StaffFormValues } from '@/modules/staff/types/staff'
import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

// Derives a username from the email's local part (before @), stripping
// anything that isn't alphanumeric/dot/underscore/hyphen. The API requires
// a username, but the Add Staff form only collects email — this keeps the
// form simple instead of asking the user to type a separate username too.
function deriveUsernameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? ''
  return localPart.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
}

export default function StaffPage() {
  const { data: session, status } = useSession()
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [staffData, setStaffData] = useState<StaffRow[]>([])

  const loadStaff = useCallback(async () => {
    if (!session?.user) return
    const response = await fetch('/api/staff?pageSize=1000')
    if (!response.ok) {
      setStaffData([])
      return
    }
    const data = await response.json()
    setStaffData(data.items ?? [])
  }, [session])

  useEffect(() => {
    void loadStaff()
  }, [loadStaff])

  function handleAddStaff(): void {
    setIsAddStaffOpen(true)
  }

  const handleSaveStaff = async (values: StaffFormValues) => {
    if (!session?.user) return
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          username: deriveUsernameFromEmail(values.email),
        }),
      })

      if (!response.ok) {
        const data = await response.json()

        throw new Error(data.message ?? 'Failed to add staff')
      }

      await loadStaff()

      showSuccessToast('Successfully added a new staff')
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to add staff')
    }
  }

  return (
    <div>
      {status === 'unauthenticated' && <p className="p-4 text-sm text-red-600">Please sign in.</p>}
      <StaffTable data={staffData} onAddStaff={handleAddStaff} />

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSave={handleSaveStaff}
      />
    </div>
  )
}
