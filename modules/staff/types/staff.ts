import type { StaffRole, StaffStatus } from '@/types/accountfield';

export interface StaffRow {
  id: number;
  department: string;
  name: string;
  email: string;
  createdAt: string;
  role: StaffRole;
  status: StaffStatus;
  branch?: string;
}

export interface StaffTableProps {
  data: StaffRow[];
  onAddStaff?: () => void;
  onUpdateStaff?: (staff: StaffRow) => void;
}

export type Department = 'finance' | 'mis';

export interface StaffFormValues {
  department: Department | '';
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AddStaffSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (values: StaffFormValues) => void;
}
