import { prisma } from '@/lib/prisma'
import { Prisma, type Member } from '@prisma/client'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getCurrentActorName } from '@/lib/auth/get-current-user'

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
  civilStatus?: string | null
  clientId?: number | null
  transactionDate?: Date | null
  dateOfBirth?: Date | null
  loanCycle?: number | null
}

function normalizeStatusValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Active' : 'Inactive'

  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (['active', '1', 'true', 'yes'].includes(normalized)) return 'Active'
  if (['inactive', '0', 'false', 'no'].includes(normalized)) return 'Inactive'

  return 'Active'
}

function normalizeMembershipValue(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase()

  if (normalized === '25' || normalized === '25.00' || normalized === 'regular') {
    return '25'
  }

  if (normalized === '50' || normalized === '50.00' || normalized === 'premium') {
    return '50'
  }

  return value?.trim() ?? ''
}

export function getMembershipLabel(value: string | null | undefined): string {
  const raw = normalizeMembershipValue(value)
  if (raw === '25') return 'Regular'
  if (raw === '50') return 'Premium'
  return value?.trim() ?? ''
}

function buildMemberCreateData(payload: MemberPayload): Prisma.MemberCreateInput {
  return {
    name: payload.name,
    membership: normalizeMembershipValue(payload.membership),
    age: payload.age,
    address: payload.address,
    status: normalizeStatusValue(payload.status),
    civilStatus: payload.civilStatus ?? null,
    clientId: payload.clientId ?? null,
    transactionDate: payload.transactionDate ?? null,
    dateOfBirth: payload.dateOfBirth ?? null,
    loanCycle: payload.loanCycle ?? null,
  }
}

function buildMemberUpdateData(payload: Partial<MemberPayload>): Prisma.MemberUpdateInput {
  const data: Prisma.MemberUpdateInput = {}

  if (typeof payload.name === 'string') data.name = payload.name
  if (typeof payload.membership === 'string') {
    data.membership = normalizeMembershipValue(payload.membership)
  }
  if (typeof payload.age === 'number') data.age = payload.age
  if (typeof payload.address === 'string') data.address = payload.address
  if (typeof payload.status === 'string') data.status = normalizeStatusValue(payload.status)
  if (payload.civilStatus !== undefined) data.civilStatus = payload.civilStatus
  if (payload.clientId !== undefined) data.clientId = payload.clientId
  if (payload.transactionDate !== undefined) data.transactionDate = payload.transactionDate
  if (payload.dateOfBirth !== undefined) data.dateOfBirth = payload.dateOfBirth
  if (payload.loanCycle !== undefined) data.loanCycle = payload.loanCycle

  return data
}

function mapMember(member: Member) {
  return {
    id: member.id,
    name: member.name,
    membership: member.membership,
    membershipLabel: getMembershipLabel(member.membership),
    age: member.age,
    address: member.address,
    status: member.status,
    civilStatus: member.civilStatus,
    clientId: member.clientId,
    transactionDate: member.transactionDate,
    dateOfBirth: member.dateOfBirth,
    loanCycle: member.loanCycle,
  }
}

export async function listMembers(params: MemberListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = Math.max(1, Math.min(5000, Number(params.pageSize ?? 10)))
  const search = params.search?.trim() ?? ''
  const branch = params.branch?.trim() ?? ''

  const where: Prisma.MemberWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { membership: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { address: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { status: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {},
      branch && branch !== 'all'
        ? { address: { contains: branch, mode: Prisma.QueryMode.insensitive } }
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

  await createActivityLog({
    type: 'created',
    title: 'Member Created',
    description: 'was added as a new member',
    subjectName: member.name,
    actorName: await getCurrentActorName(),
    actionLabel: 'Created by',
    memberId: member.id,
  })

  return mapMember(member)
}

// ---------------------------------------------------------------------------
// Combined creation — principal + beneficiaries + dependents in one
// transaction.
// ---------------------------------------------------------------------------

export interface CombinedMemberPayload {
  principal: {
    name: string
    address: string
    birthday: string
    age: string
    civilStatus: string
    weeklyContribution: string
  }
  beneficiaries: {
    primary: BeneficiaryInput
    secondary: BeneficiaryInput
  }
  dependents: DependentInput[]
}

interface BeneficiaryInput {
  name: string
  address: string
  birthday: string
  age: string
  gender: string
  relationship: string
}

interface DependentInput {
  name: string
  address: string
  birthday: string
  age: string
  gender: string
}

function membershipFromContribution(weeklyContribution: string): string {
  const amount = Number(weeklyContribution)
  if (Number.isFinite(amount) && amount >= 50) return '50'
  return '25'
}

export async function createMemberWithRelations(payload: CombinedMemberPayload) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { age: _primaryAge, ...primaryBeneficiary } = payload.beneficiaries.primary
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { age: _secondaryAge, ...secondaryBeneficiary } = payload.beneficiaries.secondary

  const member = await prisma.$transaction(async tx => {
    return tx.member.create({
      data: {
        name: payload.principal.name,
        address: payload.principal.address,
        age: Number(payload.principal.age),
        membership: membershipFromContribution(payload.principal.weeklyContribution),
        status: normalizeStatusValue('Active'),
        civilStatus: payload.principal.civilStatus,
        beneficiaries: {
          create: [
            { role: 'primary', ...primaryBeneficiary },
            { role: 'secondary', ...secondaryBeneficiary },
          ],
        },
        dependents: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          create: payload.dependents.map(({ age: _dependentAge, ...dependent }) => dependent),
        },
      },
      include: { beneficiaries: true, dependents: true },
    })
  })

  await createActivityLog({
    type: 'created',
    title: 'Member Created',
    description: 'was added as a new member, with beneficiaries and dependents',
    subjectName: member.name,
    actorName: await getCurrentActorName(),
    actionLabel: 'Created by',
    memberId: member.id,
  })

  return member
}

export async function updateMember(id: number, payload: Partial<MemberPayload>) {
  const member = await prisma.member.update({
    where: { id },
    data: buildMemberUpdateData(payload),
  })

  await createActivityLog({
    type: 'updated',
    title: 'Member Updated',
    description: 'member information was updated',
    subjectName: member.name,
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    memberId: member.id,
  })

  return mapMember(member)
}

export async function deleteMember(id: number) {
  await prisma.member.delete({ where: { id } })
}

export async function getMemberProfile(id: number) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { beneficiaries: true, dependents: true },
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
      membership: member.membership,
      membershipLabel: getMembershipLabel(member.membership),
      status: member.status,
      civilStatus: member.civilStatus,
      clientId: member.clientId,
      transactionDate: member.transactionDate,
      dateOfBirth: member.dateOfBirth,
      loanCycle: member.loanCycle,
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

// ---------------------------------------------------------------------------
// Bulk import
// ---------------------------------------------------------------------------

export interface ImportMembersResult {
  importedCount: number
  skippedCount: number
  errors: { row: number; message: string }[]
}

function parseDateCell(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return null
}

function parseMemberRow(
  row: Record<string, unknown>,
  rowNumber: number,
  errors: { row: number; message: string }[]
): MemberPayload | null {
  const name = String(row['Client name'] ?? '').trim()
  const ageRaw = row['Client age']
  const branch = String(row['Branch'] ?? '').trim()
  const area = String(row['AREA'] ?? '').trim()
  const address = [area, branch].filter(Boolean).join(' - ')

  const membershipTypeRaw = row['Membership Type']
  const totalPaymentRaw = row['Total payment amount']
  const membershipSource =
    membershipTypeRaw && String(membershipTypeRaw).trim() !== ''
      ? membershipTypeRaw
      : totalPaymentRaw

  const clientIdRaw = row['Client ID']
  const clientId = Number(clientIdRaw)
  const transactionDate = parseDateCell(row['Transaction date'])
  const dateOfBirth = parseDateCell(row['Client date of birth date'])
  const loanCycleRaw = row['Loan Cycle']
  const loanCycle = Number(loanCycleRaw)

  if (!name) {
    errors.push({ row: rowNumber, message: 'Missing Client name.' })
    return null
  }

  const age = Number(ageRaw)
  if (!Number.isFinite(age) || age <= 0) {
    errors.push({ row: rowNumber, message: 'Invalid or missing Client age.' })
    return null
  }

  if (!address) {
    errors.push({ row: rowNumber, message: 'Missing Branch/AREA.' })
    return null
  }

  return {
    name,
    membership: normalizeMembershipValue(String(membershipSource ?? '')),
    age,
    address,
    status: normalizeStatusValue('Active'),
    clientId: Number.isFinite(clientId) ? clientId : null,
    transactionDate,
    dateOfBirth,
    loanCycle: Number.isFinite(loanCycle) ? loanCycle : null,
  }
}

export async function importMembers(rows: Record<string, unknown>[]): Promise<ImportMembersResult> {
  const errors: { row: number; message: string }[] = []
  const validPayloads: MemberPayload[] = []

  rows.forEach((row, index) => {
    const payload = parseMemberRow(row, index + 2, errors)
    if (payload) validPayloads.push(payload)
  })

  if (validPayloads.length === 0) {
    return { importedCount: 0, skippedCount: rows.length, errors }
  }

  const result = await prisma.member.createMany({
    data: validPayloads.map(buildMemberCreateData),
    skipDuplicates: true,
  })

  // One log entry for the whole batch, not one per imported row — matches
  // "New 162 members added via import file" style entries from the
  // activity log design. subjectName is omitted here since there's no
  // single member being acted on.
  if (result.count > 0) {
    await createActivityLog({
      type: 'imported',
      title: 'Members Imported',
      description: `New ${result.count} members added via import file`,
      subjectName: 'Multiple Members',
      actorName: await getCurrentActorName(),
      actionLabel: 'Created by',
    })
  }

  return {
    importedCount: result.count,
    skippedCount: rows.length - result.count,
    errors,
  }
}
