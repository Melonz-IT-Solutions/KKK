// app/api/members/[id]/route.ts
import { NextResponse } from 'next/server'
import { getMemberProfile } from '@/lib/services/member-service'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memberId = Number(id)

  if (!Number.isFinite(memberId)) {
    return NextResponse.json({ message: 'Invalid member id' }, { status: 400 })
  }

  try {
    const profile = await getMemberProfile(memberId)

    if (!profile) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load member profile' }, { status: 500 })
  }
}
