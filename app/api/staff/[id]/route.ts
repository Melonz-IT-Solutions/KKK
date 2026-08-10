import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/auth/password'
import { requirePermission } from '@/lib/auth/authorize'
import { prisma } from '@/lib/prisma'

const staffUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  contactNo: z.string().optional(),
  department: z.string().min(1).optional(),
  branch: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'FINANCE', 'STAFF', 'BRANCH_MANAGER']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requirePermission('staff:change_permission')
  if (error) return error

  const { id } = await params
  const staffId = Number(id)
  if (!Number.isFinite(staffId)) {
    return NextResponse.json({ message: 'Invalid staff id' }, { status: 400 })
  }

  try {
    const payload = staffUpdateSchema.parse(await request.json())
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { userId: true },
    })
    if (!staff) return NextResponse.json({ message: 'Staff not found' }, { status: 404 })

    const passwordHash = payload.password ? await hashPassword(payload.password) : undefined
    const updated = await prisma.$transaction(async tx => {
      const updatedStaff = await tx.staff.update({
        where: { id: staffId },
        data: {
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.department !== undefined ? { department: payload.department } : {}),
          ...(payload.branch !== undefined ? { branch: payload.branch } : {}),
          ...(payload.role !== undefined ? { role: payload.role } : {}),
          ...(payload.active !== undefined ? { active: payload.active } : {}),
          ...(passwordHash ? { password: passwordHash } : {}),
        },
      })

      if (staff.userId) {
        await tx.user.update({
          where: { id: staff.userId },
          data: {
            ...(payload.name !== undefined ? { name: payload.name } : {}),
            ...(payload.role !== undefined ? { roles: payload.role } : {}),
            ...(payload.active !== undefined ? { active: payload.active } : {}),
            ...(payload.contactNo !== undefined ? { contactNo: payload.contactNo } : {}),
            ...(passwordHash ? { password: passwordHash } : {}),
          },
        })
      }

      return updatedStaff
    })

    return NextResponse.json(updated)
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requirePermission('staff:change_permission')
  if (error) return error

  const { id } = await params
  const staffId = Number(id)
  if (!Number.isFinite(staffId)) {
    return NextResponse.json({ message: 'Invalid staff id' }, { status: 400 })
  }

  try {
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { userId: true },
    })
    if (!staff) return NextResponse.json({ message: 'Staff not found' }, { status: 404 })

    await prisma.$transaction(async tx => {
      if (staff.userId) {
        await tx.user.update({
          where: { id: staff.userId },
          data: { active: false, isDeleted: true },
        })
      }

      await tx.staff.delete({ where: { id: staffId } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to remove staff' }, { status: 500 })
  }
}
