import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createReport, listReports } from '@/lib/services/report-service'
import { requirePermission } from '@/lib/auth/authorize'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
const reportSchema = z.object({
  type: z.string().min(1),
  dateRangeStart: z.string().min(1),
  dateRangeEnd: z.string().min(1),
  generatedDate: z.string().min(1),
})

export async function GET() {
  const { error } = await requirePermission('reports:view')
  if (error) return error

  try {
    const reports = await listReports()

    return NextResponse.json(reports)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ message: 'Failed to load reports' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { error } = await requirePermission('reports:generate')
  if (error) return error

  try {
    const payload = reportSchema.parse(await request.json())

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = Number(session.user.id)

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        staff: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const report = await createReport(
      payload,
      user.name ?? 'System',
      user.staff?.id ?? null,
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

    console.error(error)

    return NextResponse.json({ message: 'Failed to create report' }, { status: 500 })
  }
}
