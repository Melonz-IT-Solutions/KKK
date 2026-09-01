import { cookies } from 'next/headers'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

import { parseRole, normalizeRole, type ActiveRole, type StaffRole } from './permissions'

export const ACTIVE_ROLE_COOKIE = 'active-role'

async function getAuthenticatedUser() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const userId = Number(session.user.id)

  if (!Number.isInteger(userId)) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      roles: true,
      active: true,
      isDeleted: true,
    },
  })

  if (!user) {
    return null
  }

  if (!user.active || user.isDeleted) {
    return null
  }

  return user
}

export async function getAuthenticatedRole(): Promise<StaffRole | null> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return null
  }

  return parseRole(user.roles)
}

export async function getEffectiveRole(): Promise<ActiveRole | null> {
  const authenticatedRole = await getAuthenticatedRole()

  if (!authenticatedRole) {
    return null
  }

  if (authenticatedRole !== 'SUPER_ADMIN') {
    return authenticatedRole
  }

  const cookieStore = await cookies()
  const selectedRole = cookieStore.get(ACTIVE_ROLE_COOKIE)?.value

  if (!selectedRole) {
    return 'SUPER_ADMIN'
  }

  const normalizedRole = normalizeRole(selectedRole)

  const allowedRoles: ActiveRole[] = ['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'FDO']

  if (!allowedRoles.includes(normalizedRole)) {
    return 'SUPER_ADMIN'
  }

  return normalizedRole
}

export async function getRoleContext() {
  const user = await getAuthenticatedUser()

  if (!user) {
    return {
      user: null,
      authenticatedRole: null,
      effectiveRole: null,
      realRole: null,
      isSuperAdmin: false,
    }
  }

  const authenticatedRole = parseRole(user.roles)

  if (!authenticatedRole) {
    return {
      user: null,
      authenticatedRole: null,
      effectiveRole: null,
      realRole: null,
      isSuperAdmin: false,
    }
  }

  const effectiveRole =
    authenticatedRole === 'SUPER_ADMIN' ? await getEffectiveRole() : authenticatedRole

  return {
    user,
    authenticatedRole,
    realRole: authenticatedRole,
    effectiveRole,
    isSuperAdmin: authenticatedRole === 'SUPER_ADMIN',
  }
}
