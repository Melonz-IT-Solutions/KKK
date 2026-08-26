export const ROLES = ['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'STAFF'] as const

export type StaffRole = (typeof ROLES)[number]
export type ActiveRole = StaffRole

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

export function normalizeRole(value: unknown): StaffRole {
  if (typeof value !== 'string') {
    return 'STAFF'
  }

  const normalized = value.trim().toUpperCase().replace(/-/g, '_').replace(/\s+/g, '_')

  return isStaffRole(normalized) ? normalized : 'STAFF'
}

export function parseRole(value: unknown): StaffRole | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toUpperCase().replace(/-/g, '_').replace(/\s+/g, '_')

  return isStaffRole(normalized) ? normalized : null
}

export const PERMISSIONS = [
  'member:view',
  'member:create',
  'member:import',

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
    'member:view',
    'member:create',
    'member:import',

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
    'member:view',
    'member:create',
    'member:import',

    'staff:import',
    'staff:view_all',
    'staff:view_own_branch',

    'activity_logs:view',

    'settings:access',

    'reports:view',
    'reports:generate',
  ],

  BRANCH_MANAGER: [
    'member:view',
    'member:create',
    'member:import',

    'staff:view_own_branch',

    'reports:view',
    'reports:generate',
  ],

  STAFF: ['member:view', 'member:create', 'member:import'],
}

export function hasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
