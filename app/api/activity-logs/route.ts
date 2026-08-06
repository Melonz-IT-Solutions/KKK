import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createActivityLog, listActivityLogs } from '@/lib/services/activity-log-service'

const activityLogSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  actorName: z.string().min(1),
  actionLabel: z.string().min(1),
  date: z.string().min(1),
  memberId: z.number().optional(),
  staffId: z.number().optional(),
  userId: z.number().optional(),
})

export async function GET() {
  try {
    const logs = await listActivityLogs()
    return NextResponse.json(logs)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load activity logs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = activityLogSchema.parse(await request.json())
    const log = await createActivityLog(payload)
    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json({ message: 'Failed to create activity log' }, { status: 500 })
  }
}
