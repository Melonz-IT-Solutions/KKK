import { prisma } from '@/lib/prisma'
import { Prisma, type Member } from '@prisma/client'

export interface MemberListParams {
  search?: string
  branch?: string
  page?: number
  pageSize?: number
}

export interface MemberPayload {
  name: string
  membership: string
  age: number
  address: string
  status: string
}

function normalizeMembershipValue(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase()

  if (normalized === '25' || normalized === '25.00' || normalized === 'regular') {
    return 'Regular'
  }

  if (normalized === '50' || normalized === '50.00' || normalized === 'premium') {
    return 'Premium'
  }

  return value?.trim() ?? ''
}

function buildMemberCreateData(payload: MemberPayload): Prisma.MemberCreateInput {
  return {
    name: payload.name,
    membership: normalizeMembershipValue(payload.membership),
    age: payload.age,
    address: payload.address,
    status: payload.status,
  }
}

function buildMemberUpdateData(payload: Partial<MemberPayload>): Prisma.MemberUpdateInput {
  const data: Prisma.MemberUpdateInput = {}

  if (typeof payload.name === 'string') {
    data.name = payload.name
  }

  if (typeof payload.membership === 'string') {
    data.membership = normalizeMembershipValue(payload.membership)
  }

  if (typeof payload.age === 'number') {
    data.age = payload.age
  }

  if (typeof payload.address === 'string') {
    data.address = payload.address
  }

  if (typeof payload.status === 'string') {
    data.status = payload.status
  }

  return data
}

function mapMember(member: Member) {
  return {
    id: member.id,
    name: member.name,
    membership: normalizeMembershipValue(member.membership),
    age: member.age,
    address: member.address,
    status: member.status,
  }
}

export async function listMembers(params: MemberListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = Math.max(1, Math.min(100, Number(params.pageSize ?? 10)))
  const search = params.search?.trim() ?? ''
  const branch = params.branch?.trim() ?? ''

  const where: Prisma.MemberWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              {
                membership: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                address: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                status: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
            ],
          }
        : {},
      branch && branch !== 'all'
        ? {
            address: { contains: branch, mode: Prisma.QueryMode.insensitive },
          }
        : {},
    ].filter(Boolean),
  }

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.member.count({ where }),
  ])

  return {
    items: items.map(mapMember),
    total,
    page,
    pageSize,
  }
}

export async function getMember(id: number) {
  const member = await prisma.member.findUnique({ where: { id } })
  return member ? mapMember(member) : null
}

export async function createMember(payload: MemberPayload) {
  const member = await prisma.member.create({
    data: buildMemberCreateData(payload),
  })
  return mapMember(member)
}

export async function updateMember(id: number, payload: Partial<MemberPayload>) {
  const member = await prisma.member.update({
    where: { id },
    data: buildMemberUpdateData(payload),
  })
  return mapMember(member)
}

export async function deleteMember(id: number) {
  await prisma.member.delete({ where: { id } })
}
// Add this to your existing member-service.ts (alongside createMember, updateMember, etc.)

export interface ImportMembersResult {
  importedCount: number
  skippedCount: number
  errors: { row: number; message: string }[]
}

// Validates and normalizes one raw spreadsheet row into a MemberPayload.
// Returns null (and pushes an error) if the row is unusable.
function parseMemberRow(
  row: Record<string, unknown>,
  rowNumber: number,
  errors: { row: number; message: string }[]
): MemberPayload | null {
  const name = String(row.name ?? row.Name ?? '').trim()
  const membershipRaw = row.membership ?? row.Membership
  const ageRaw = row.age ?? row.Age
  const address = String(row.address ?? row.Address ?? '').trim()
  const status = String(row.status ?? row.Status ?? '').trim()

  if (!name) {
    errors.push({ row: rowNumber, message: 'Missing name.' })
    return null
  }

  const age = Number(ageRaw)
  if (!Number.isFinite(age) || age <= 0) {
    errors.push({ row: rowNumber, message: 'Invalid or missing age.' })
    return null
  }

  if (!address) {
    errors.push({ row: rowNumber, message: 'Missing address.' })
    return null
  }

  return {
    name,
    membership: normalizeMembershipValue(String(membershipRaw ?? '')),
    age,
    address,
    status: status || 'Active',
  }
}

// Add to member-service.ts

export async function getMemberProfile(id: number) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      beneficiaries: true,
      dependents: true,
    },
  })

  if (!member) return null

  const primary = member.beneficiaries.find(b => b.role === 'primary')
  const secondary = member.beneficiaries.find(b => b.role === 'secondary')

  return {
    principal: {
      id: member.id,
      name: member.name,
      address: member.address,
      age: member.age,
      membership: normalizeMembershipValue(member.membership),
      status: member.status,
      civilStatus: member.civilStatus,
      createdAt: member.createdAt,
    },
    beneficiaries: {
      primary: primary
        ? {
            name: primary.name,
            address: primary.address,
            birthday: primary.birthday,
            gender: primary.gender,
            relationship: primary.relationship,
          }
        : null,
      secondary: secondary
        ? {
            name: secondary.name,
            address: secondary.address,
            birthday: secondary.birthday,
            gender: secondary.gender,
            relationship: secondary.relationship,
          }
        : null,
    },
    dependents: member.dependents.map(d => ({
      id: d.id,
      name: d.name,
      address: d.address,
      birthday: d.birthday,
      gender: d.gender,
    })),
  }
}
// modules/members/data/member-service.ts

export interface ImportMembersResult {
  importedCount: number
}

export async function importMembers(file: File): Promise<ImportMembersResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/members/import', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.message ?? 'Failed to import members.')
  }

  return res.json()
}

// export async function importMembers(rows: Record<string, unknown>[]): Promise<ImportMembersResult> {
//   const errors: { row: number; message: string }[] = []
//   const validPayloads: MemberPayload[] = []

//   rows.forEach((row, index) => {
//     // +2 accounts for the header row and 1-based row numbering, so the
//     // error message matches the row number the user sees in Excel.
//     const payload = parseMemberRow(row, index + 2, errors)
//     if (payload) validPayloads.push(payload)
//   })

//   if (validPayloads.length === 0) {
//     return { importedCount: 0, skippedCount: rows.length, errors }
//   }

//   const result = await prisma.member.createMany({
//     data: validPayloads.map(buildMemberCreateData),
//     skipDuplicates: true,
//   })

//   return {
//     importedCount: result.count,
//     skippedCount: rows.length - result.count,
//     errors,
//   }
// }
