import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedRole } from '@/lib/auth/effective-role'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const realRole = await getAuthenticatedRole()

  if (realRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const branchId = Number(id)

  if (!Number.isInteger(branchId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
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
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: { name, clusterId },
      include: { cluster: { select: { id: true, name: true } } },
    })

    return NextResponse.json(branch)
  } catch (error: unknown) {
    const isUniqueViolation =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'

    if (isUniqueViolation) {
      return NextResponse.json({ error: 'A branch with that name already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 })
  }
}
