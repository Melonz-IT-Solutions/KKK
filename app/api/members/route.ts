import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createMember,
  createMemberWithRelations,
  deleteMember,
  listMembers,
  updateMember,
} from '@/lib/services/member-service'

const memberSchema = z.object({
  name: z.string().min(1),
  membership: z.string().min(1),
  age: z.number().int().min(1),
  address: z.string().min(1),
  status: z.string().min(1),
})

const combinedMemberSchema = z.object({
  principal: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    birthday: z.string().min(1),
    age: z.string().min(1),
    civilStatus: z.string().min(1),
    weeklyContribution: z.string().min(1),
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '10')
  const search = searchParams.get('search') ?? ''
  const branch = searchParams.get('branch') ?? ''

  try {
    const result = await listMembers({ page, pageSize, search, branch })
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to load members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json()
    const payload = memberSchema.safeParse(rawPayload)

    if (payload.success) {
      const member = await createMember(payload.data)
      return NextResponse.json(member, { status: 201 })
    }

    const combinedPayload = combinedMemberSchema.parse(rawPayload)
    const member = await createMemberWithRelations(combinedPayload)

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid payload', errors: error.flatten() },
        { status: 400 }
      )
    }
    console.error(error)
    return NextResponse.json({ message: 'Failed to create member' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...payload } = await request.json()
    if (!id) {
      return NextResponse.json({ message: 'Member id is required' }, { status: 400 })
    }
    const member = await updateMember(Number(id), memberSchema.partial().parse(payload))
    return NextResponse.json(member)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to update member' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'Member id is required' }, { status: 400 })
    }
    await deleteMember(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to delete member' }, { status: 500 })
  }
}
