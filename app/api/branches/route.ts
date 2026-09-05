import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedRole } from '@/lib/auth/effective-role'
import { hasPermissionAsync } from '@/lib/auth/get-role-permissions'

export async function GET() {
  const realRole = await getAuthenticatedRole()

  if (!realRole) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canView = await hasPermissionAsync(realRole, 'branch:view')

  if (!canView) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const branches = await prisma.branch.findMany({
    include: {
      cluster: { select: { id: true, name: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(branches)
}

export async function POST(request: Request) {
  const realRole = await getAuthenticatedRole()

  if (realRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json()) as { name?: string; clusterId?: number }
  const name = body.name?.trim()
  const clusterId = body.clusterId

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  if (!clusterId || !Number.isInteger(clusterId)) {
    return NextResponse.json({ error: 'clusterId is required' }, { status: 400 })
  }

  try {
    const branch = await prisma.branch.create({
      data: { name, clusterId },
      include: { cluster: { select: { id: true, name: true } } },
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error: unknown) {
    const isUniqueViolation =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'

    if (isUniqueViolation) {
      return NextResponse.json({ error: 'A branch with that name already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 })
  }
}
