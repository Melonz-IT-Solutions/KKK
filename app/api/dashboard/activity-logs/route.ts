import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const startOfToday = new Date()

    startOfToday.setHours(0, 0, 0, 0)

    const startOfTomorrow = new Date(startOfToday)

    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)

    const activities = await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        subjectName: true,
        actorName: true,
        actionLabel: true,
        createdAt: true,
        memberId: true,
        userId: true,
      },
    })

    return NextResponse.json({
      activities,
    })
  } catch (error) {
    console.error('Failed to load today activity logs:', error)

    return NextResponse.json(
      {
        message: 'Failed to load activity logs',
      },
      {
        status: 500,
      }
    )
  }
}
