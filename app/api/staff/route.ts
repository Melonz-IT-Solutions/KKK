// app/api/staff/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createStaff, listStaff } from '@/lib/services/staff-service'

import { hasPermission, ROLES, type StaffRole } from '@/lib/auth/permissions'

import { requirePermission, requireSession } from '@/lib/auth/authorize'

// -----------------------------------------------------------------------------
// Schema
// -----------------------------------------------------------------------------

type ConfigurableRole = Exclude<StaffRole, 'SUPER_ADMIN'>

const CONFIGURABLE_ROLES = ROLES.filter(
  (role): role is ConfigurableRole => role !== 'SUPER_ADMIN'
) as [ConfigurableRole, ...ConfigurableRole[]]

const createStaffSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),

  email: z.string().trim().email('Invalid email'),

  username: z.string().trim().min(1, 'Username is required'),

  password: z.string().min(8, 'Password must be at least 8 characters'),

  contactNo: z.string().trim().optional(),

  department: z.string().trim().min(1, 'Department is required'),

  branch: z.string().trim().optional(),

  cluster: z.string().trim().optional(),

  role: z.enum(CONFIGURABLE_ROLES),
})

// -----------------------------------------------------------------------------
// GET /api/staff
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  const { error, user } = await requireSession()

  if (error || !user) {
    return error
  }

  try {
    const canViewAll = hasPermission(user.role, 'staff:view_all')
    // -------------------------------------------------------------------------
    // Determine branch filter
    // -------------------------------------------------------------------------

    let branch: string | undefined

    if (canViewAll) {
      /**
       * Super Admin / Finance
       *
       * No branch filter.
       */
      branch = undefined
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to view staff.',
        },
        {
          status: 403,
        }
      )
    }

    // -------------------------------------------------------------------------
    // Query parameters
    // -------------------------------------------------------------------------

    const { searchParams } = new URL(request.url)

    const pageParam = Number(searchParams.get('page') ?? '1')

    const pageSizeParam = Number(searchParams.get('pageSize') ?? '10')

    const page = Number.isFinite(pageParam) ? Math.max(1, Math.floor(pageParam)) : 1

    const pageSize = Number.isFinite(pageSizeParam) ? Math.max(1, Math.floor(pageSizeParam)) : 10

    const search = searchParams.get('search')?.trim() ?? ''

    // -------------------------------------------------------------------------
    // Load staff
    // -------------------------------------------------------------------------

    const result = await listStaff({
      page,
      pageSize,
      search,
      branch,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('List staff error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load staff',
      },
      {
        status: 500,
      }
    )
  }
}

// -----------------------------------------------------------------------------
// POST /api/staff
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  const { error } = await requirePermission('staff:create')

  if (error) {
    return error
  }

  try {
    const body = await request.json()

    const payload = createStaffSchema.parse(body)

    const staff = await createStaff(payload)

    return NextResponse.json(
      {
        success: true,
        message: 'Staff created successfully',
        data: staff,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    // -------------------------------------------------------------------------
    // Validation error
    // -------------------------------------------------------------------------

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload',
          errors: error.flatten(),
        },
        {
          status: 400,
        }
      )
    }

    // -------------------------------------------------------------------------
    // Duplicate username/email
    // -------------------------------------------------------------------------

    if (error instanceof Error && error.message === 'Username or email already exists') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 409,
        }
      )
    }

    // -------------------------------------------------------------------------
    // Unexpected error
    // -------------------------------------------------------------------------

    console.error('Create staff error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create staff',
      },
      {
        status: 500,
      }
    )
  }
}
