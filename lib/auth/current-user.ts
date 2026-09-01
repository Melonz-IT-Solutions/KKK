import 'server-only'

import { auth } from '@/auth'
import {
  ROLE_LABELS,
  isStaffRole,
  hasPermission,
  type Permission,
  type StaffRole,
} from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export interface CurrentUser {
  id: string
  name: string
  email: string
  department: string
  branch: string | null
  role: StaffRole
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth()
  const id = Number(session?.user?.id)
  if (!Number.isInteger(id)) return null

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      branchManagers: { include: { branch: true }, take: 1 },
    },
  })

  if (!user || !user.active || user.isDeleted || !isStaffRole(user.roles)) return null

  return {
    id: String(user.id),
    name: user.name ?? '',
    email: user.email,
    department: user.department ?? '',
    branch: user.branchManagers[0]?.branch.name ?? null,
    role: user.roles,
  }
}

export const isSuperAdmin = (user: CurrentUser) => user.role === 'SUPER_ADMIN'
export const isFinance = (user: CurrentUser) => user.role === 'FINANCE'
export const isBranchManager = (user: CurrentUser) => user.role === 'BRANCH_MANAGER'
export const userHasPermission = (user: CurrentUser, permission: Permission) =>
  hasPermission(user.role, permission)

export { ROLE_LABELS }
