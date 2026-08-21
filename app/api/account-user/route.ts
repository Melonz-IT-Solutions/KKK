import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSettingsAccount, updateSettingsAccount } from '@/lib/services/settings-service'

export async function GET() {
  try {
    const session = await auth()

    const userId = Number(session?.user?.id)

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const account = await getSettingsAccount(userId)

    return NextResponse.json(account)
  } catch (error) {
    console.error('GET /api/settings/account:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to load account information',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    const userId = Number(session?.user?.id)

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const account = await updateSettingsAccount(userId, body.accountInfo)

    return NextResponse.json(account)
  } catch (error) {
    console.error('PUT /api/settings/account:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to update account information',
      },
      { status: 400 }
    )
  }
}
