// app/api/auth/active-role/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

import {
  ACTIVE_ROLE_COOKIE,
  ACTIVE_ROLE_CONTEXT_COOKIE,
  getActiveRoleContext,
  getAuthenticatedRole,
  getEffectiveRole,
} from '@/lib/auth/effective-role'

import { isStaffRole, normalizeRole, type ActiveRole } from '@/lib/auth/permissions'
import { getPermissionsForRole } from '@/lib/auth/get-role-permissions'

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

const activeRoleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'FINANCE', 'MIS', 'CLUSTER_MANAGER', 'BRANCH_MANAGER', 'FDO']),
  clusterId: z.number().int().positive().optional(),
  branchId: z.number().int().positive().optional(),
})

// -----------------------------------------------------------------------------
// Entity name resolution
// -----------------------------------------------------------------------------

async function resolveEntityName(
  effectiveRole: ActiveRole,
  realRole: ActiveRole
): Promise<string | null> {
  if (effectiveRole === 'CLUSTER_MANAGER') {
    if (realRole === 'SUPER_ADMIN') {
      const { clusterId } = await getActiveRoleContext()

      if (!clusterId) {
        return null
      }

      const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } })

      return cluster?.name ?? null
    }

    const session = await auth()
    const userId = Number(session?.user?.id)

    if (!Number.isInteger(userId)) {
      return null
    }

    const clusterManager = await prisma.clusterManager.findFirst({
      where: { userId },
      include: { cluster: true },
    })

    return clusterManager?.cluster.name ?? null
  }

  if (effectiveRole === 'BRANCH_MANAGER') {
    if (realRole === 'SUPER_ADMIN') {
      const { branchId } = await getActiveRoleContext()

      if (!branchId) {
        return null
      }

      const branch = await prisma.branch.findUnique({ where: { id: branchId } })

      return branch?.name ?? null
    }

    const session = await auth()

    return session?.user?.branch ?? null
  }

  return null
}

// -----------------------------------------------------------------------------
// Cookie options
// -----------------------------------------------------------------------------

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24,
}

// -----------------------------------------------------------------------------
// GET
// -----------------------------------------------------------------------------

export async function GET() {
  try {
    const realRole = await getAuthenticatedRole()

    if (!realRole || !isStaffRole(realRole)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const effectiveRole = await getEffectiveRole()

    if (!effectiveRole) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid effective role.',
        },
        {
          status: 403,
        }
      )
    }

    const permissions = await getPermissionsForRole(effectiveRole)
    const entityName = await resolveEntityName(effectiveRole, realRole)

    return NextResponse.json(
      {
        success: true,
        role: effectiveRole,
        realRole,
        isSuperAdmin: realRole === 'SUPER_ADMIN',
        permissions,
        entityName,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Failed to get active role:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get active role.',
      },
      {
        status: 500,
      }
    )
  }
}

// -----------------------------------------------------------------------------
// POST
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    /**
     * getAuthenticatedRole() reads the real database role.
     */
    const realRole = await getAuthenticatedRole()

    if (realRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Only Super Admin can switch roles.',
        },
        {
          status: 403,
        }
      )
    }

    const body = await request.json()

    const result = activeRoleSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role.',
        },
        {
          status: 400,
        }
      )
    }

    const selectedRole = normalizeRole(result.data.role)

    if (!isStaffRole(selectedRole)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role.',
        },
        {
          status: 400,
        }
      )
    }

    let entityName: string | null = null

    if (selectedRole === 'CLUSTER_MANAGER') {
      if (!result.data.clusterId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Please select a cluster.',
          },
          {
            status: 400,
          }
        )
      }

      const cluster = await prisma.cluster.findUnique({ where: { id: result.data.clusterId } })

      if (!cluster) {
        return NextResponse.json(
          {
            success: false,
            message: 'Cluster not found.',
          },
          {
            status: 404,
          }
        )
      }

      entityName = cluster.name
    } else if (selectedRole === 'BRANCH_MANAGER') {
      if (!result.data.branchId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Please select a branch.',
          },
          {
            status: 400,
          }
        )
      }

      const branch = await prisma.branch.findUnique({ where: { id: result.data.branchId } })

      if (!branch) {
        return NextResponse.json(
          {
            success: false,
            message: 'Branch not found.',
          },
          {
            status: 404,
          }
        )
      }

      entityName = branch.name
    }

    const response = NextResponse.json(
      {
        success: true,
        role: selectedRole,
        realRole,
        entityName,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )

    response.cookies.set({
      name: ACTIVE_ROLE_COOKIE,
      value: selectedRole,
      ...COOKIE_OPTIONS,
    })

    if (selectedRole === 'CLUSTER_MANAGER' || selectedRole === 'BRANCH_MANAGER') {
      response.cookies.set({
        name: ACTIVE_ROLE_CONTEXT_COOKIE,
        value: JSON.stringify({
          clusterId: selectedRole === 'CLUSTER_MANAGER' ? result.data.clusterId : null,
          branchId: selectedRole === 'BRANCH_MANAGER' ? result.data.branchId : null,
        }),
        ...COOKIE_OPTIONS,
      })
    } else {
      response.cookies.delete(ACTIVE_ROLE_CONTEXT_COOKIE)
    }

    return response
  } catch (error) {
    console.error('Failed to switch active role:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to switch role.',
      },
      {
        status: 500,
      }
    )
  }
}

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------

export async function DELETE() {
  try {
    const realRole = await getAuthenticatedRole()

    if (realRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          success: false,
          message: 'Only Super Admin can reset the active role.',
        },
        {
          status: 403,
        }
      )
    }

    const response = NextResponse.json(
      {
        success: true,
        role: 'SUPER_ADMIN',
        realRole,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )

    /**
     * Actually remove the cookie.
     *
     * No cookie = Super Admin mode.
     */
    response.cookies.delete(ACTIVE_ROLE_COOKIE)
    response.cookies.delete(ACTIVE_ROLE_CONTEXT_COOKIE)

    return response
  } catch (error) {
    console.error('Failed to reset active role:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reset active role.',
      },
      {
        status: 500,
      }
    )
  }
}
