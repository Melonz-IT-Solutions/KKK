import type { StaffStatus } from '@/types/accountfield'
import type { StaffRole } from '@/lib/auth/permissions'

export type Department = string

export interface StaffRow {
  id: number
  department: string
  name: string
  email: string
  username: string
  createdAt: string
  role: StaffRole
  status: StaffStatus
  branch?: string
}

export interface StaffFormValues {
  username: string
  department: Department | ''
  role: Exclude<StaffRole, 'SUPER_ADMIN'> | ''
  branch: string
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface StaffUpdateValues extends StaffRow {
  newPassword?: string
}

export interface StaffTableProps {
  data: StaffRow[]
  onAddStaff?: () => void
  onUpdateStaff?: (staff: StaffUpdateValues) => Promise<void>
}

export interface AddStaffSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (values: StaffFormValues) => Promise<void> | void
}
