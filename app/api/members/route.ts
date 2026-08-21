import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  createMember,
  createMemberWithRelations,
  listMembers,
  updateMember,
  deleteMember,
} from '@/lib/services/member-service'

// ---------------------------------------------------------------------------
// Simple Member Schema
// ---------------------------------------------------------------------------

const memberSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string(),
  lastName: z.string().min(1),
  membership: z.string().min(1),
  age: z.number().int().min(1),
  address: z.string().min(1),
  status: z.string().min(1),
  civilStatus: z.string().optional(),
  clientId: z.number().int().optional().nullable(),
  transactionDate: z.coerce.date().optional().nullable(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  loanCycle: z.number().int().optional().nullable(),
  statusChangedAt: z.coerce.date().optional().nullable(),
})

// ---------------------------------------------------------------------------
// Combined Member Schema
// Used by Add Member UI
// ---------------------------------------------------------------------------

const combinedMemberSchema = z.object({
  principal: z.object({
    firstName: z.string().min(1),
    middleName: z.string(),
    lastName: z.string().min(1),

    address: z.string().min(1),

    birthday: z.string().min(1),

    age: z.string().min(1),

    civilStatus: z.string().min(1),

    weeklyContribution: z.string().min(1),

    transactionDate: z.coerce.date().optional().nullable(),
  }),

  beneficiaries: z.object({
    primary: z.object({
      name: z.string(),
      address: z.string(),
      birthday: z.string(),
      age: z.string(),
      gender: z.string(),
      relationship: z.string(),
    }),

    secondary: z.object({
      name: z.string(),
      address: z.string(),
      birthday: z.string(),
      age: z.string(),
      gender: z.string(),
      relationship: z.string(),
    }),
  }),

  dependents: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
      birthday: z.string(),
      age: z.string(),
      gender: z.string(),
    })
  ),
})

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = Number(searchParams.get('page') ?? '1')

  const pageSize = Number(searchParams.get('pageSize') ?? '10')

  const search = searchParams.get('search') ?? ''

  const branch = searchParams.get('branch') ?? ''

  const statusParam = searchParams.get('status')

  const status = statusParam === 'hidden' || statusParam === 'all' ? statusParam : 'active'

  try {
    const result = await listMembers({
      page,
      pageSize,
      search,
      branch,
      status,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to load members:', error)

    return NextResponse.json(
      {
        message: 'Failed to load members',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json()

    // ------------------------------------------------------------
    // Try the simple member payload first
    // ------------------------------------------------------------

    const payload = memberSchema.safeParse(rawPayload)

    if (payload.success) {
      const member = await createMember(payload.data)

      return NextResponse.json(member, {
        status: 201,
      })
    }

    // ------------------------------------------------------------
    // Try the combined Add Member payload
    // ------------------------------------------------------------

    const combinedPayload = combinedMemberSchema.parse(rawPayload)

    const member = await createMemberWithRelations(combinedPayload)

    return NextResponse.json(member, {
      status: 201,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid payload',

          errors: error.flatten(),
        },
        {
          status: 400,
        }
      )
    }

    console.error('Failed to create member:', error)

    return NextResponse.json(
      {
        message: 'Failed to create member',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------------------------------------
// PATCH
// ---------------------------------------------------------------------------

export async function PATCH(request: Request) {
  try {
    const { id, ...payload } = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          message: 'Member id is required',
        },
        {
          status: 400,
        }
      )
    }

    const parsedPayload = memberSchema.partial().parse(payload)

    const member = await updateMember(Number(id), parsedPayload)

    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid payload',

          errors: error.flatten(),
        },
        {
          status: 400,
        }
      )
    }

    console.error('Failed to update member:', error)

    return NextResponse.json(
      {
        message: 'Failed to update member',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          message: 'Member id is required',
        },
        {
          status: 400,
        }
      )
    }

    const memberId = Number(id)

    if (!Number.isInteger(memberId)) {
      return NextResponse.json(
        {
          message: 'Invalid member id',
        },
        {
          status: 400,
        }
      )
    }

    await deleteMember(memberId)

    return NextResponse.json({
      success: true,
      message: 'Member hidden successfully',
    })
  } catch (error) {
    console.error('Failed to hide member:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to hide member',
      },
      {
        status: 500,
      }
    )
  }
}
