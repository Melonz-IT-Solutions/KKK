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

/* -------------------------------------------------------------------------- */
/* Role checks                                                                */
/* -------------------------------------------------------------------------- */

export const isSuperAdmin = (user: CurrentUser) => user.role === 'SUPER_ADMIN'

export const isFinance = (user: CurrentUser) => user.role === 'FINANCE'

export const isStaffUser = (user: CurrentUser) => user.role === 'STAFF_USER'

export const isBranchManager = (user: CurrentUser) => user.role === 'BRANCH_MANAGER'

/* -------------------------------------------------------------------------- */
/* Department checks                                                          */
/* -------------------------------------------------------------------------- */

export const isFinanceDepartment = (user: CurrentUser) =>
  user.role === 'FINANCE' || user.department === 'Finance'

/* -------------------------------------------------------------------------- */
/* Permission checks                                                          */
/* -------------------------------------------------------------------------- */

export const hasPermission = (user: CurrentUser, permission: Permission) => {
  if (user.role === 'SUPER_ADMIN') return true

  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false
}

/* -------------------------------------------------------------------------- */
/* Staff management                                                           */
/* -------------------------------------------------------------------------- */

export const canManageStaffUsers = (user: CurrentUser) =>
  hasPermission(user, 'users:create') || hasPermission(user, 'users:edit')

export const canCreateStaff = (user: CurrentUser) => hasPermission(user, 'users:create')

export const canEditStaff = (user: CurrentUser) => hasPermission(user, 'users:edit')

export const canDeleteStaff = (user: CurrentUser) => hasPermission(user, 'users:delete')

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

export const canManageSettings = (user: CurrentUser) => hasPermission(user, 'settings:manage')

/* -------------------------------------------------------------------------- */
/* Existing record restrictions                                               */
/* -------------------------------------------------------------------------- */

// Re-editing already-submitted records (members, staff, etc.) is restricted
// to Super Admin, Finance, and Branch Manager.
// Staff User can create but cannot edit existing records.
export const canReEdit = (user: CurrentUser) =>
  isSuperAdmin(user) || isFinanceDepartment(user) || isBranchManager(user)

/* -------------------------------------------------------------------------- */
/* Role restrictions                                                          */
/* -------------------------------------------------------------------------- */

export const canManageRoles = (user: CurrentUser) => isSuperAdmin(user) || isFinance(user)

export const canManageSuperAdmin = (user: CurrentUser) => isSuperAdmin(user)

export const canManageFinance = (user: CurrentUser) => isSuperAdmin(user)

export const canManageBranchManager = (user: CurrentUser) => isSuperAdmin(user) || isFinance(user)

export const canManageStaffUser = (user: CurrentUser) =>
  isSuperAdmin(user) || isFinance(user) || isBranchManager(user)

/* -------------------------------------------------------------------------- */
/* Branch restrictions                                                        */
/* -------------------------------------------------------------------------- */

export const canManageAllBranches = (user: CurrentUser) => isSuperAdmin(user)

export const canManageBranch = (user: CurrentUser) => isSuperAdmin(user) || isBranchManager(user)

/* -------------------------------------------------------------------------- */
/* Role labels                                                                */
/* -------------------------------------------------------------------------- */

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  FINANCE: 'Finance',
  STAFF_USER: 'Staff User',
  BRANCH_MANAGER: 'Branch Manager',
}
