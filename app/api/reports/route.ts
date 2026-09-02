import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createReport, listReports } from '@/lib/services/report-service'

import { requirePermission } from '@/lib/auth/authorize'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const reportSchema = z.object({
  type: z.enum(['Total Members', 'Total Mortality']),

  dateRangeStart: z.string().min(1),

  dateRangeEnd: z.string().min(1),

  generatedDate: z.string().min(1),
})

export async function GET() {
  const { error } = await requirePermission('reports:view')

  if (error) {
    return error
  }

  try {
    const reports = await listReports()

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Load reports error:', error)

    return NextResponse.json(
      {
        message: 'Failed to load reports',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error } = await requirePermission('reports:generate')

  if (error) {
    return error
  }

  try {
    const payload = reportSchema.parse(await request.json())

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const userId = Number(session.user.id)

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        { status: 404 }
      )
    }

    const startDate = new Date(`${payload.dateRangeStart}T00:00:00`)

    const endDate = new Date(`${payload.dateRangeEnd}T23:59:59.999`)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          message: 'Invalid date range',
        },
        { status: 400 }
      )
    }

    if (startDate > endDate) {
      return NextResponse.json(
        {
          message: 'Start date cannot be after end date',
        },
        { status: 400 }
      )
    }

    let total = 0

    // ------------------------------------------------------------
    // TOTAL MEMBERS
    // Uses Member.transactionDate
    // ------------------------------------------------------------

    if (payload.type === 'Total Members') {
      total = await prisma.member.count({
        where: {
          isDeleted: false,

          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
    }

    // ------------------------------------------------------------
    // TOTAL MORTALITY
    // Uses Member.statusChangedAt
    // when member becomes Inactive.
    // ------------------------------------------------------------

    if (payload.type === 'Total Mortality') {
      total = await prisma.member.count({
        where: {
          isDeleted: false,

          status: 'Inactive',

          statusChangedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
    }

    const report = await createReport(
      {
        type: payload.type === 'Total Members' ? 'MEMBER' : 'MORTALITY',

        total,

        dateRangeStart: payload.dateRangeStart,

        dateRangeEnd: payload.dateRangeEnd,

        generatedDate: payload.generatedDate,
      },

      user.name ?? 'System',

      user.id
    )

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid payload',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    console.error('Create report error:', error)

    return NextResponse.json(
      {
        message: 'Failed to create report',
      },
      { status: 500 }
    )
  }
}
