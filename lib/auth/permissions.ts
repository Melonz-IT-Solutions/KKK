export const ROLES = [
  'SUPER_ADMIN',
  'FINANCE',
  'MIS',
  'CLUSTER_MANAGER',
  'BRANCH_MANAGER',
  'FDO',
  'OPERATIONS',
  'ADMIN_AND_HR',
  'ACCOUNTING',
  'AUDIT_DEPARTMENT',
  'GUEST',
] as const

export type StaffRole = (typeof ROLES)[number]
export type ActiveRole = StaffRole

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

export function normalizeRole(value: unknown): StaffRole {
  if (typeof value !== 'string') {
    return 'GUEST'
  }

  const normalized = value.trim().toUpperCase().replace(/-/g, '_').replace(/\s+/g, '_')

  return isStaffRole(normalized) ? normalized : 'GUEST'
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

  'cluster:view',
  'branch:view',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLE_LABELS: Record<StaffRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  FINANCE: 'Finance',
  MIS: 'MIS',
  CLUSTER_MANAGER: 'Cluster Manager',
  BRANCH_MANAGER: 'Branch Manager',
  FDO: 'FDO',
  OPERATIONS: 'Operations',
  ADMIN_AND_HR: 'Admin and HR',
  ACCOUNTING: 'Accounting',
  AUDIT_DEPARTMENT: 'Audit Department',
  GUEST: 'Guest',
}

const ALL_PERMISSIONS: readonly Permission[] = PERMISSIONS

const ALL_EXCEPT_ACTIVITY_LOGS: readonly Permission[] = PERMISSIONS.filter(
  p => p !== 'activity_logs:view'
)

export const ROLE_PERMISSIONS: Record<StaffRole, readonly Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,

  FINANCE: ALL_EXCEPT_ACTIVITY_LOGS,

  MIS: ALL_EXCEPT_ACTIVITY_LOGS,

  CLUSTER_MANAGER: [
    'member:view',
    'member:create',
    'member:import',
    'staff:view_own_branch',
    'reports:view',
    'reports:generate',
    'settings:access',
  ],

  BRANCH_MANAGER: ['member:view'],

  FDO: ['member:view', 'member:create', 'member:import', 'reports:view', 'reports:generate'],

  OPERATIONS: ['member:view', 'reports:view'],

  ADMIN_AND_HR: ['member:view', 'reports:view'],

  ACCOUNTING: ['member:view', 'reports:view'],

  AUDIT_DEPARTMENT: ['member:view', 'reports:view'],

  GUEST: ['member:view'],
}

export function hasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
