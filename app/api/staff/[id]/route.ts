import { NextResponse } from 'next/server'
import { z } from 'zod'

import { deleteStaff, updateStaff } from '@/lib/services/staff-service'

import { requirePermission } from '@/lib/auth/authorize'

const staffUpdateSchema = z.object({
  name: z.string().min(1).optional(),

  contactNo: z.string().optional(),

  department: z.string().min(1).optional(),

  branch: z.string().optional(),

  role: z.enum(['SUPER_ADMIN', 'FINANCE', 'STAFF', 'BRANCH_MANAGER']).optional(),

  active: z.boolean().optional(),

  password: z.string().min(8).optional(),
})

interface StaffRouteContext {
  params: Promise<{
    id: string
  }>
}

function getStaffId(id: string) {
  const staffId = Number(id)

  if (!Number.isInteger(staffId) || staffId <= 0) {
    throw new Error('Invalid staff id')
  }

  return staffId
}

export async function PATCH(request: Request, { params }: StaffRouteContext) {
  const { error } = await requirePermission('staff:change_permission')

  if (error) {
    return error
  }

  try {
    const { id } = await params

    const staffId = getStaffId(id)

    const body = await request.json()

    const payload = staffUpdateSchema.parse(body)

    const staff = await updateStaff(staffId, payload)

    return NextResponse.json({
      success: true,
      message: 'Staff updated successfully',
      staff,
    })
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

    if (error instanceof Error && error.message === 'Invalid staff id') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Staff not found') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 404 }
      )
    }

    if (error instanceof Error && error.message.includes('SUPER_ADMIN cannot be assigned')) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      )
    }

    console.error('Failed to update staff:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update staff',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: StaffRouteContext) {
  const { error } = await requirePermission('staff:change_permission')

  if (error) {
    return error
  }

  try {
    const { id } = await params

    const staffId = getStaffId(id)

    await deleteStaff(staffId)

    return NextResponse.json({
      success: true,
      message: 'Staff deactivated successfully',
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid staff id') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Staff not found') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 404 }
      )
    }

    console.error('Failed to deactivate staff:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to deactivate staff',
      },
      { status: 500 }
    )
  }
}
