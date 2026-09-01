import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createActivityLog, listActivityLogs } from '@/lib/services/activity-log-service'
import { requirePermission } from '@/lib/auth/authorize'

const activityLogSchema = z.object({
  type: z.enum(['created', 'updated', 'imported']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subjectName: z.string().min(1, 'Subject name is required'),
  actorName: z.string().min(1, 'Actor name is required'),
  actionLabel: z.string().min(1, 'Action label is required'),
  date: z.string().min(1, 'Date is required'),

  memberId: z.number().optional(),
  userId: z.number().optional(),
})

export async function GET() {
  const { error } = await requirePermission('activity_logs:view')
  if (error) return error

  try {
    const logs = await listActivityLogs()

    return NextResponse.json({
      success: true,
      data: logs,
    })
  } catch (error) {
    console.error('Load activity logs error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load activity logs',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const { error } = await requirePermission('staff:change_permission')
  if (error) return error

  try {
    const body = await request.json()

    const payload = activityLogSchema.parse(body)

    const log = await createActivityLog(payload)

    return NextResponse.json(
      {
        success: true,
        data: log,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    console.error('Create activity log error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create activity log',
      },
      { status: 500 }
    )
  }
}
