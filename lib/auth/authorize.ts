import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { hasPermission, type Permission } from '@/lib/auth/permissions'

export async function requireSession() {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json({ message: 'Unauthenticated' }, { status: 401 }),
      user: null,
    }
  }

  return { error: null, user: session.user }
}

export async function requirePermission(permission: Permission) {
  const { error, user } = await requireSession()
  if (error || !user) return { error, user: null }

  if (!hasPermission(user.role, permission)) {
    return {
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
      user: null,
    }
  }

  return { error: null, user }
}
