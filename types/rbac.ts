import type { StaffRole } from '@/types/accountfield'

export type Permission =
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'finance:view'
  | 'finance:edit'
  | 'branch:manage'
  | 'settings:manage'

export type { StaffRole } from '@/types/accountfield'

export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  SUPER_ADMIN: [
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'finance:view',
    'finance:edit',
    'branch:manage',
    'settings:manage',
  ],
  FINANCE: ['finance:view', 'finance:edit'],
  BRANCH_MANAGER: ['users:view', 'branch:manage'],
  STAFF_USER: ['users:view'],
  SYSTEM_MANAGER: [
    'users:view',
    'users:create',
    'users:edit',
    'finance:view',
    'finance:edit',
    'branch:manage',
  ],
}
