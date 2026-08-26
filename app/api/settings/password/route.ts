import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await auth()

    const userId = Number(session?.user?.id)

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const currentPassword = String(body.currentPassword ?? '')
    const newPassword = String(body.newPassword ?? '')
    const confirmPassword = String(body.confirmPassword ?? '')

    if (!currentPassword) {
      return NextResponse.json(
        {
          message: 'Current password is required',
        },
        {
          status: 400,
        }
      )
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          message: 'New password is required',
        },
        {
          status: 400,
        }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          message: 'New passwords do not match',
        },
        {
          status: 400,
        }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message: 'New password must be at least 8 characters',
        },
        {
          status: 400,
        }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
        active: true,
        isDeleted: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        {
          status: 404,
        }
      )
    }

    if (!user.active || user.isDeleted) {
      return NextResponse.json(
        {
          message: 'User account is inactive',
        },
        {
          status: 403,
        }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        {
          message: 'Password is not configured for this account',
        },
        {
          status: 400,
        }
      )
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.password)

    if (!passwordMatches) {
      return NextResponse.json(
        {
          message: 'Current password is incorrect',
        },
        {
          status: 400,
        }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: 'Password updated successfully',
    })
  } catch (error) {
    console.error('PUT /api/settings/password error:', error)

    return NextResponse.json(
      {
        message: 'Failed to update password',
      },
      {
        status: 500,
      }
    )
  }
}
