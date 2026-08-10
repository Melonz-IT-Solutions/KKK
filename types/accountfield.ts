import { LucideIcon } from 'lucide-react'
import type { Department } from '@/constants/departments'
import { DEPARTMENT_NAMES } from '@/constants/departments'
export type { Department } from '@/constants/departments'

// =====================
// ENUM TYPES
// =====================

export type StaffRole = 'SUPER_ADMIN' | 'FINANCE' | 'BRANCH_MANAGER' | 'STAFF'

export type StaffStatus = 'ACTIVE' | 'INACTIVE'

// =====================
// DATABASE STAFF TYPE
// =====================

export interface Staff {
  id: string

  avatar?: string

  firstName: string
  lastName: string

  fullName: string
  username: string
  email: string
  contactNumber: string

  department: Department
  role: StaffRole

  password: string

  status: StaffStatus

  createdAt: Date
  updatedAt: Date
}

// =====================
// REUSABLE INFO FIELD
// =====================

export interface InfoFieldProps {
  label: string
  value: string
  onChange: (value: string) => void

  type?: React.HTMLInputTypeAttribute
  placeholder?: string

  options?: readonly string[]
}

// =====================
// ACCOUNT FORM
// =====================

export type AccountInfo = {
  firstName: string
  middleName: string
  lastName: string
  email: string
  contactNumber: string
}

export type AccountStatus = StaffStatus

export interface AccountSectionProps {
  roles: StaffRole[]

  addRole: (role: StaffRole) => void

  removeRole: (role: StaffRole) => void

  accountInfo: AccountInfo

  updateField: (field: keyof AccountInfo, value: string) => void

  accountStatus?: AccountStatus

  toggleAccountStatus?: () => void
}

// =====================
// PASSWORD
// =====================

export interface PasswordInfo {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordSectionProps {
  passwordInfo: PasswordInfo

  updateField: (field: keyof PasswordInfo, value: string) => void

  onSubmit: () => void
}

// =====================
// TABLE
// =====================

export interface StaffTableColumn {
  label: string

  key: keyof Staff

  icon?: LucideIcon
}

// =====================
// DATA
// =====================

export const STAFF_ROLES: StaffRole[] = ['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'STAFF']

export const DEPARTMENTS = DEPARTMENT_NAMES
