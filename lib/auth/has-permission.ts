import type { StaffRole } from '@/types/accountfield'

import { ROLE_PERMISSIONS, type Permission } from './permissions'

export function hasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
