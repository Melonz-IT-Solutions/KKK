import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createStaff, listStaff } from '@/lib/services/staff-service'
import { hasPermission } from '@/lib/auth/permissions'
import { requirePermission, requireSession } from '@/lib/auth/authorize'

const createStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  contactNo: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  branch: z.string().optional(),
})

export async function GET(request: Request) {
  const { error, user } = await requireSession()
  if (error || !user) return error

  const canViewAll = hasPermission(user.role, 'staff:view_all')
  const canViewOwnBranch = hasPermission(user.role, 'staff:view_own_branch')

  if (!canViewAll && (!canViewOwnBranch || !user.branch)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '10')
  const search = searchParams.get('search') ?? ''

  try {
    const result = await listStaff({
      page,
      pageSize,
      search,
      branch: canViewAll ? undefined : (user.branch ?? undefined),
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('List staff error:', error)
    return NextResponse.json({ success: false, message: 'Failed to load staff' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { error } = await requirePermission('staff:create')
  if (error) return error

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
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Username or email already exists') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 409 }
      )
    }

    console.error('Create staff error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create staff',
      },
      { status: 500 }
    )
  }
}
