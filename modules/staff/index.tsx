'use client'

import { useState } from 'react'

import StaffTable from '@/modules/staff/components/staff-table'
import AddStaffSheet from '@/modules/staff/components/add-staff-sheet'

import { useStaff } from '@/modules/staff/hooks/use-staff'

import type { StaffFormValues } from '@/modules/staff/types/staff'

export default function StaffModule() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)

  const { staff, loading, addStaff, updateStaff } = useStaff()

  const handleSaveStaff = async (values: StaffFormValues) => {
    const username = values.email
      .split('@')[0]
      ?.replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase()

    await addStaff({
      ...values,
      username,
    })

    setIsAddStaffOpen(false)
  }

  return (
    <div>
      <StaffTable
        data={staff}
        loading={loading}
        onAddStaff={() => setIsAddStaffOpen(true)}
        onUpdateStaff={updateStaff}
      />

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSave={handleSaveStaff}
      />
    </div>
  )
}
