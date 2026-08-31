import { prisma } from '@/lib/prisma'
import { ROLE_PERMISSIONS, type Permission, type StaffRole } from './permissions'

export async function getPermissionsForRole(role: StaffRole): Promise<Permission[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(prisma as any).role) return [...ROLE_PERMISSIONS[role]]

    const dbRole = await prisma.role.findUnique({
      where: { name: role },
      include: { permissions: { select: { name: true } } },
    })

    if (dbRole) {
      return dbRole.permissions.map(p => p.name) as Permission[]
    }
  } catch (error) {
    console.error('Failed to load role permissions from DB:', error)
  }

  return [...ROLE_PERMISSIONS[role]]
}

export async function hasPermissionAsync(
  role: StaffRole,
  permission: Permission
): Promise<boolean> {
  const perms = await getPermissionsForRole(role)
  return perms.includes(permission)
}
