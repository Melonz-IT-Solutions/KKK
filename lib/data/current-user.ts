import type { Permission } from '@/types/rbac'
import { ROLE_PERMISSIONS } from '@/types/rbac'
import type { StaffRole } from '@/types/accountfield'

export type UserRole = StaffRole

export interface CurrentUser {
  id: string
  name: string
  email: string
  department: string
  branch?: string
  role: UserRole
}

export const currentUser: CurrentUser = {
  id: '1',
  name: 'Super Admin',
  email: 'super-admin@kkk.com',
  department: 'Central Operations',
  branch: 'Talon-Talon',
  role: 'SUPER_ADMIN',
}

export const isBranchManager = (user: CurrentUser) => user.role === 'BRANCH_MANAGER'
export const isSuperAdmin = (user: CurrentUser) => user.role === 'SUPER_ADMIN'
export const isFinanceDepartment = (user: CurrentUser) =>
  user.role === 'FINANCE' || user.department === 'Finance'

export const hasPermission = (user: CurrentUser, permission: Permission) => {
  if (user.role === 'SUPER_ADMIN') return true
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false
}

export const canManageStaffUsers = (user: CurrentUser) =>
  hasPermission(user, 'users:create') || hasPermission(user, 'users:edit')

export const canManageSettings = (user: CurrentUser) => hasPermission(user, 'settings:manage')
