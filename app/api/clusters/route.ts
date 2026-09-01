import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
