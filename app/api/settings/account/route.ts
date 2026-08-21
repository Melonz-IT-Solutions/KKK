import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

function splitName(name: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
    }
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      middleName: '',
      lastName: '',
    }
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      middleName: '',
      lastName: parts[1],
    }
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(' '),
    lastName: parts[parts.length - 1],
  }
}

// GET CURRENT ACCOUNT
export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
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

    const name = splitName(user.name)

    return NextResponse.json({
      id: user.id,
      firstName: name.firstName,
      middleName: name.middleName,
      lastName: name.lastName,
      email: user.email,
      contactNumber: user.contactNo ?? '',
    })
  } catch (error) {
    console.error('GET /api/settings/account error:', error)

    return NextResponse.json(
      {
        message: 'Failed to load account information',
      },
      {
        status: 500,
      }
    )
  }
}

// UPDATE CURRENT ACCOUNT
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

    const firstName = String(body.firstName ?? '').trim()
    const middleName = String(body.middleName ?? '').trim()
    const lastName = String(body.lastName ?? '').trim()
    const email = String(body.email ?? '').trim()
    const contactNumber = String(body.contactNumber ?? '').trim()

    if (!firstName) {
      return NextResponse.json(
        {
          message: 'First name is required',
        },
        {
          status: 400,
        }
      )
    }

    if (!lastName) {
      return NextResponse.json(
        {
          message: 'Last name is required',
        },
        {
          status: 400,
        }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          message: 'Email is required',
        },
        {
          status: 400,
        }
      )
    }

    const name = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    })

    if (existingEmail) {
      return NextResponse.json(
        {
          message: 'Email is already being used',
        },
        {
          status: 409,
        }
      )
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        contactNo: contactNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
      },
    })

    return NextResponse.json({
      message: 'Account information updated successfully',
      user,
    })
  } catch (error) {
    console.error('PUT /api/settings/account error:', error)

    return NextResponse.json(
      {
        message: 'Failed to update account information',
      },
      {
        status: 500,
      }
    )
  }
}
