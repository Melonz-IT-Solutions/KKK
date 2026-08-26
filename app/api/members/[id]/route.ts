import { NextResponse } from 'next/server'

import { getMemberProfile, deleteMember, updateMemberProfile } from '@/lib/services/member-service'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// ---------------------------------------------------------------------------
// GET MEMBER PROFILE
// GET /api/members/[id]
// ---------------------------------------------------------------------------

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params

  const memberId = Number(id)

  if (!Number.isInteger(memberId) || memberId <= 0) {
    return NextResponse.json(
      {
        message: 'Invalid member id',
      },
      {
        status: 400,
      }
    )
  }

  try {
    const profile = await getMemberProfile(memberId)

    if (!profile) {
      return NextResponse.json(
        {
          message: 'Member not found',
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to load member profile:', error)

    return NextResponse.json(
      {
        message: 'Failed to load member profile',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------------------------------------
// PATCH MEMBER PROFILE
// PATCH /api/members/[id]
// ---------------------------------------------------------------------------

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params

  const memberId = Number(id)

  if (!Number.isInteger(memberId) || memberId <= 0) {
    return NextResponse.json(
      {
        message: 'Invalid member id',
      },
      {
        status: 400,
      }
    )
  }

  try {
    const body = await request.json()

    const profile = await updateMemberProfile(memberId, body)

    return NextResponse.json({
      success: true,
      message: 'Member profile updated successfully',
      profile,
    })
  } catch (error) {
    console.error('Failed to update member profile:', error)

    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return NextResponse.json(
        {
          message: 'Member not found',
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update member profile',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------------------------------------
// DELETE / HIDE MEMBER
// DELETE /api/members/[id]
// ---------------------------------------------------------------------------

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params

  const memberId = Number(id)

  if (!Number.isInteger(memberId) || memberId <= 0) {
    return NextResponse.json(
      {
        message: 'Invalid member id',
      },
      {
        status: 400,
      }
    )
  }

  try {
    await deleteMember(memberId)

    return NextResponse.json({
      success: true,
      message: 'Member hidden successfully',
    })
  } catch (error) {
    console.error('Failed to hide member:', error)

    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return NextResponse.json(
        {
          message: 'Member not found',
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to hide member',
      },
      {
        status: 500,
      }
    )
  }
}
