import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/authorize'
import { ROLES, ROLE_LABELS } from '@/lib/auth/permissions'

function buildStaticResponse() {
  return {
    roles: ROLES.filter(name => name !== 'SUPER_ADMIN').map(name => ({
      name,
      label: ROLE_LABELS[name],
    })),
  }
}

export async function GET() {
  const { error } = await requirePermission('staff:create')

  if (error) {
    return error
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(prisma as any).role) {
      return NextResponse.json(buildStaticResponse())
    }

    const roles = await prisma.role.findMany({
      where: { name: { not: 'SUPER_ADMIN' } },
      select: { name: true, label: true },
      orderBy: { id: 'asc' },
    })

    return NextResponse.json({ roles })
  } catch (error) {
    console.error('GET /api/staff/departments error:', error)

    return NextResponse.json(buildStaticResponse())
  }
}
