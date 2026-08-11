'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import StaffTable from '@/modules/staff/components/staff-table/staff-v2-table'
import { AddStaffSheet } from '@/modules/staff/components/staff-add/staff-v2-addstaff'
import type { StaffRow, StaffFormValues } from '@/modules/staff/types/staff'
import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

function deriveUsernameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? ''
  return localPart.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
}

function StaffPageContent() {
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status')

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [staffData, setStaffData] = useState<StaffRow[]>([])

  const loadStaff = async () => {
    const response = await fetch('/api/staff?pageSize=1000')
    const data = await response.json()
    setStaffData(data.items ?? [])
  }

  useEffect(() => {
    void loadStaff()
  }, [])

  const filteredStaffData = useMemo(() => {
    if (!statusParam) return staffData
    const targetStatus = statusParam.toUpperCase()
    return staffData.filter(staff => staff.status === targetStatus)
  }, [staffData, statusParam])

  function handleAddStaff(): void {
    setIsAddStaffOpen(true)
  }

  const handleSaveStaff = async (values: StaffFormValues) => {
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
      {statusParam && (
        <p className="text-muted-foreground px-4 pt-4 text-sm">
          Showing {statusParam === 'active' ? 'Active' : 'Inactive'} staff only —{' '}
          <a href="/staff" className="underline">
            clear filter
          </a>
        </p>
      )}

      <StaffTable data={filteredStaffData} onAddStaff={handleAddStaff} />

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSave={handleSaveStaff}
      />
    </div>
  )
}

export default function StaffPage() {
  return (
    <Suspense fallback={null}>
      <StaffPageContent />
    </Suspense>
  )
}
