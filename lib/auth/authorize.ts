import { NextResponse } from 'next/server'

import { isStaffRole, type Permission, type StaffRole } from '@/lib/auth/permissions'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'

import { getRoleContext } from '@/lib/auth/effective-role'

export interface AuthorizedUser {
  id: string
  name: string
  email: string
  username: string
  role: StaffRole
  realRole: StaffRole
}

export async function requireSession() {
  try {
    const context = await getRoleContext()

    if (!context.user || !context.authenticatedRole || !context.effectiveRole) {
      return {
        error: NextResponse.json(
          {
            message: 'Unauthenticated',
          },
          {
            status: 401,
          }
        ),
        user: null,
      }
    }

    if (!isStaffRole(context.authenticatedRole)) {
      return {
        error: NextResponse.json(
          {
            message: 'Invalid user role',
          },
          {
            status: 403,
          }
        ),
        user: null,
      }
    }

    if (!isStaffRole(context.effectiveRole)) {
      return {
        error: NextResponse.json(
          {
            message: 'Invalid effective role',
          },
          {
            status: 403,
          }
        ),
        user: null,
      }
    }

    const user: AuthorizedUser = {
      id: String(context.user.id),
      name: context.user.name ?? '',
      email: context.user.email,
      username: context.user.username,
      role: context.effectiveRole,
      realRole: context.authenticatedRole,
    }

    return {
      error: null,
      user,
    }
  } catch (error) {
    console.error('Authorization error:', error)

    return {
      error: NextResponse.json(
        {
          message: 'Authentication failed',
        },
        {
          status: 500,
        }
      ),
      user: null,
    }
  }
}

export async function requirePermission(permission: Permission) {
  const { error, user } = await requireSession()

  if (error || !user) {
    return {
      error,
      user: null,
    }
  }

  if (!(await hasPermissionAsync(user.role, permission))) {
    return {
      error: NextResponse.json(
        {
          message: 'Forbidden',
          permission,
          role: user.role,
        },
        {
          status: 403,
        }
      ),
      user: null,
    }
  }

  return {
    error: null,
    user,
  }
}

export async function requireSuperAdmin() {
  const { error, user } = await requireSession()

  if (error || !user) {
    return {
      error,
      user: null,
    }
  }

  if (user.realRole !== 'SUPER_ADMIN') {
    return {
      error: NextResponse.json(
        {
          message: 'Super Admin access required',
        },
        {
          status: 403,
        }
      ),
      user: null,
    }
  }

  return {
    error: null,
    user,
  }
}
