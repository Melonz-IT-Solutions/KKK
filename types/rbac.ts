import type { StaffRole } from '@/types/accountfield'

export type Permission =
  // Staff
  | 'staff:view'
  | 'staff:view_branch'
  | 'staff:create'
  | 'staff:import'
  | 'staff:change_permission'
  | 'staff:reset_password'
  | 'staff:activate'
  | 'staff:deactivate'

  // Activity Logs
  | 'activity_logs:view'

  // Settings
  | 'settings:view'
  | 'settings:manage'

  // Reports
  | 'reports:view'
  | 'reports:generate'

export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  SUPER_ADMIN: [
    'staff:view',
    'staff:view_branch',
    'staff:create',
    'staff:import',
    'staff:change_permission',
    'staff:reset_password',
    'staff:activate',
    'staff:deactivate',

    'activity_logs:view',

    'settings:view',
    'settings:manage',

    'reports:view',
    'reports:generate',
  ],

  FINANCE: [
    'staff:view',
    'staff:view_branch',
    'staff:import',

    'activity_logs:view',

    'settings:view',
    'settings:manage',

    'reports:view',
    'reports:generate',
  ],

  BRANCH_MANAGER: ['staff:view_branch', 'reports:view', 'reports:generate'],

  STAFF: ['reports:view', 'reports:generate'],
}
