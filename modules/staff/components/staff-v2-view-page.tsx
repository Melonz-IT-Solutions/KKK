'use client';

import { useEffect, useState } from 'react';

import StaffTable from '@/modules/staff/components/staff-v2-table';
import { AddStaffSheet } from './staff-v2-addstaff';
import type { StaffRow } from '@/modules/staff/types/staff';

export default function StaffPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffData, setStaffData] = useState<StaffRow[]>([]);

  const loadStaff = async () => {
    const response = await fetch('/api/staff');
    const data = await response.json();
    setStaffData(data.items ?? []);
  };

  useEffect(() => {
    void loadStaff();
  }, []);

  function handleAddStaff(): void {
    setIsAddStaffOpen(true);
  }

  return (
    <div>
      <div>
        <StaffTable data={staffData} onAddStaff={handleAddStaff} />
      </div>

      <AddStaffSheet
        open={isAddStaffOpen}
        onOpenChange={setIsAddStaffOpen}
        onSave={async (values) => {
          await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          await loadStaff();
        }}
      />
    </div>
  );
}
