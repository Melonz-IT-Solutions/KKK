import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentActor, getManagedClusterIds } from '@/lib/auth/get-current-user'
import { getAuthenticatedRole } from '@/lib/auth/effective-role'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // ?scope=admin — returns all clusters regardless of effective role.
  // Only honored for real SUPER_ADMIN (reads from DB, not the active-role cookie).
  // Used by the department switcher so a SUPER_ADMIN who has already switched to
  // BRANCH_MANAGER can still see all branches when switching again.
  if (searchParams.get('scope') === 'admin') {
    const realRole = await getAuthenticatedRole()

    if (realRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const clusters = await prisma.cluster.findMany({
      include: {
        branches: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(clusters)
  }

  const actor = await getCurrentActor()

  if (!actor) {
    return NextResponse.json([], { status: 401 })
  }

  if (actor.role === 'BRANCH_MANAGER') {
    // Find the branch record matching the actor's branch name
    if (!actor.branch) {
      return NextResponse.json([])
    }

    const branch = await prisma.branch.findFirst({
      where: { name: { equals: actor.branch, mode: 'insensitive' } },
      include: { cluster: true },
    })

    if (!branch) {
      return NextResponse.json([])
    }

    return NextResponse.json([
      {
        id: branch.cluster.id,
        name: branch.cluster.name,
        branches: [{ id: branch.id, name: branch.name }],
      },
    ])
  }

  if (actor.role === 'CLUSTER_MANAGER') {
    const clusterIds = await getManagedClusterIds(actor)

    const clusters = await prisma.cluster.findMany({
      where: { id: { in: clusterIds } },
      include: {
        branches: {
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(clusters)
  }

  // SUPER_ADMIN and others — return all
  const clusters = await prisma.cluster.findMany({
    include: {
      branches: {
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(clusters)
}
