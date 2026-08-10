// lib/auth/permissions.ts
export const ROLES = ['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'STAFF'] as const

export type StaffRole = (typeof ROLES)[number]

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && ROLES.includes(value as StaffRole)
}

export const PERMISSIONS = [
  'staff:create',
  'staff:import',
  'staff:view_all',
  'staff:view_own_branch',
  'staff:change_permission',
  'staff:reset_password',
  'staff:activate',
  'staff:deactivate',
  'activity_logs:view',
  'settings:access',
  'reports:view',
  'reports:generate',
  'reports:delete',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLE_LABELS: Record<StaffRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  FINANCE: 'Finance',
  BRANCH_MANAGER: 'Branch Manager',
  STAFF: 'Staff User',
}

export const ROLE_PERMISSIONS: Record<StaffRole, readonly Permission[]> = {
  SUPER_ADMIN: [
    'staff:create',
    'staff:import',
    'staff:view_all',
    'staff:view_own_branch',
    'staff:change_permission',
    'staff:reset_password',
    'staff:activate',
    'staff:deactivate',
    'activity_logs:view',
    'settings:access',
    'reports:view',
    'reports:generate',
  ],

  FINANCE: [
    'staff:import',
    'staff:view_all',
    'staff:view_own_branch',
    'activity_logs:view',
    'settings:access',
    'reports:view',
    'reports:generate',
  ],

  BRANCH_MANAGER: ['staff:view_own_branch', 'reports:view', 'reports:generate'],

  STAFF: [],
}

export function hasPermission(role: StaffRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission)
}
