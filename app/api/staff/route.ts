import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createStaff, deleteStaff, listStaff, updateStaff } from '@/lib/services/staff-service'
import {
  currentUser,
  isFinanceDepartment,
  isSuperAdmin,
  isBranchManager,
} from '@/lib/data/current-user'

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  department: z.string().min(1),
  password: z.string().min(8).optional(),
  active: z.boolean().optional(),
  role: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '10')
  const search = searchParams.get('search') ?? ''

  try {
    let branchFilter: string | undefined
    if (isBranchManager(currentUser)) {
      branchFilter = currentUser.branch?.trim() ?? undefined
    }

    const result = await listStaff({
      page,
      pageSize,
      search,
      branch: branchFilter,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load staff' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (isFinanceDepartment(currentUser)) {
      return NextResponse.json(
        { message: 'Finance users cannot create staff directly' },
        { status: 403 }
      )
    }

    const payload = staffSchema.parse(await request.json())
    const staff = await createStaff(payload)
    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json({ message: 'Failed to create staff' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...payload } = await request.json()
    if (!id) return NextResponse.json({ message: 'Staff id is required' }, { status: 400 })

    const parsedPayload = staffSchema.partial().parse(payload)
    if ((parsedPayload.role || parsedPayload.password) && !isSuperAdmin(currentUser)) {
      return NextResponse.json(
        {
          message: 'Only Super Admin can update permissions or reset password',
        },
        { status: 403 }
      )
    }

    const staff = await updateStaff(Number(id), parsedPayload)
    return NextResponse.json(staff)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json({ message: 'Failed to update staff' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ message: 'Staff id is required' }, { status: 400 })
    await deleteStaff(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to delete staff' }, { status: 500 })
  }
}
