import type { StaffStatus } from '@/types/accountfield'
import type { StaffRole } from '@/lib/auth/permissions'

export type Department = string

export interface StaffRow {
  id: number
  department: string
  // name: string
  email: string
  username: string
  firstName: string
  lastName: string
  clientId: string
  createdAt: string
  role: StaffRole
  status: StaffStatus
  branch?: string
  cluster?: string
}

export interface StaffFormValues {
  username: string
  department: Department | ''
  role: Exclude<StaffRole, 'SUPER_ADMIN'> | ''
  branch: string
  cluster: string
  firstName: string
  lastName: string
  clientId: string
  email: string
  password: string
  confirmPassword: string
}

export interface StaffUpdateValues extends StaffRow {
  firstName: string
  lastName: string
  newPassword?: string
}

export interface StaffTableProps {
  data: StaffRow[]
  loading?: boolean
  onAddStaff?: () => void
  onUpdateStaff?: (staff: StaffUpdateValues) => Promise<void>
}

export interface AddStaffSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (values: StaffFormValues) => Promise<void> | void
}
