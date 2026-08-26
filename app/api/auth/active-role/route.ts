// app/api/auth/active-role/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  ACTIVE_ROLE_COOKIE,
  getAuthenticatedRole,
  getEffectiveRole,
} from '@/lib/auth/effective-role'

import { isStaffRole, normalizeRole } from '@/lib/auth/permissions'

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

const activeRoleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER', 'STAFF']),
})

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

    return NextResponse.json(
      {
        success: true,
        role: effectiveRole,
        realRole,
        isSuperAdmin: realRole === 'SUPER_ADMIN',
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

    const response = NextResponse.json(
      {
        success: true,
        role: selectedRole,
        realRole,
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
