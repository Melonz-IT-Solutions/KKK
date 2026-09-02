import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentActor, getManagedClusterIds } from '@/lib/auth/get-current-user'

export async function GET() {
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
