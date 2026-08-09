import { NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

const scryptAsync = promisify(scrypt)

const EDIT_ALLOWED_ROLES = ['SUPER_ADMIN', 'FINANCE', 'BRANCH_MANAGER']

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

  return `${salt}:${derivedKey.toString('hex')}`
}

async function requireEditPermission() {
  const session = await auth()

  const role = (session?.user as { role?: string } | undefined)?.role

  if (!role || !EDIT_ALLOWED_ROLES.includes(role)) {
    return NextResponse.json(
      {
        message: 'You do not have permission to perform this action',
      },
      { status: 403 }
    )
  }

  return null
}

const staffUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  contactNo: z.string().optional(),
  department: z.string().min(1).optional(),
  branch: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'FINANCE', 'STAFF_USER', 'BRANCH_MANAGER']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionError = await requireEditPermission()

  if (permissionError) return permissionError

  const { id } = await params
  const staffId = Number(id)

  if (!Number.isFinite(staffId)) {
    return NextResponse.json({ message: 'Invalid staff id' }, { status: 400 })
  }

  try {
    const rawPayload = await request.json()
    const payload = staffUpdateSchema.parse(rawPayload)

    const data: Record<string, unknown> = {}

    if (payload.name !== undefined) {
      data.name = payload.name
    }

    if (payload.department !== undefined) {
      data.department = payload.department
    }

    if (payload.branch !== undefined) {
      data.branch = payload.branch
    }

    if (payload.role !== undefined) {
      data.role = payload.role
    }

    if (payload.active !== undefined) {
      data.active = payload.active
    }

    if (payload.password) {
      data.password = await hashPassword(payload.password)
    }

    if (payload.contactNo !== undefined) {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
      })

      if (staff?.userId) {
        await prisma.user.update({
          where: { id: staff.userId },
          data: {
            contactNo: payload.contactNo,
          },
        })
      }
    }

    const updated = await prisma.staff.update({
      where: { id: staffId },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid payload',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    console.error(error)

    return NextResponse.json({ message: 'Failed to update staff' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const permissionError = await requireEditPermission()

  if (permissionError) return permissionError

  const { id } = await params
  const staffId = Number(id)

  if (!Number.isFinite(staffId)) {
    return NextResponse.json({ message: 'Invalid staff id' }, { status: 400 })
  }

  try {
    await prisma.staff.delete({
      where: { id: staffId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ message: 'Failed to remove staff' }, { status: 500 })
  }
}
