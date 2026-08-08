'use client'

import { useEffect, useState } from 'react'

import StaffTable from '@/modules/staff/components/staff-v2-table'
import { AddStaffSheet } from './staff-v2-addstaff'
import type { StaffRow } from '@/modules/staff/types/staff'
import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

export default function StaffPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [staffData, setStaffData] = useState<StaffRow[]>([])

  const loadStaff = async () => {
    const response = await fetch('/api/staff')
    const data = await response.json()
    setStaffData(data.items ?? [])
  }

  useEffect(() => {
    void loadStaff()
  }, [])

  function handleAddStaff(): void {
    setIsAddStaffOpen(true)
  }

  return (
    <div>
      <StaffTable data={staffData} onAddStaff={handleAddStaff} />

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSave={async values => {
          try {
            const response = await fetch('/api/staff', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
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
        }}
      />
    </div>
  )
}
