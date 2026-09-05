import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/password'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function POST(request: Request) {
  const session = await auth()

  const userId = Number(session?.user?.id)

  if (!Number.isInteger(userId)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { password } = schema.parse(body)

    const hashed = await hashPassword(password)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 }
      )
    }

    console.error('setup-password error:', error)

    return NextResponse.json({ message: 'Failed to update password' }, { status: 500 })
  }
}
