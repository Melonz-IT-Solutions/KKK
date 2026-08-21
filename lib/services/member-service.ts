import { prisma } from '@/lib/prisma'
import { Prisma, type Member } from '@prisma/client'

import { createActivityLog } from '@/lib/services/activity-log-service'

import { getCurrentActor, getCurrentActorName } from '@/lib/auth/get-current-user'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type MemberStatusFilter = 'active' | 'hidden' | 'all'

export interface MemberListParams {
  search?: string
  branch?: string
  page?: number
  pageSize?: number
  status?: MemberStatusFilter

  /**
   * When true, do not paginate.
   */
  all?: boolean
}

export interface MemberPayload {
  firstName: string
  middleName?: string | null
  lastName: string

  membership: string
  age: number
  address: string

  status: string

  civilStatus?: string | null
  clientId?: number | null
  transactionDate?: Date | null
  dateOfBirth?: Date | null
  loanCycle?: number | null
  statusChangedAt?: Date | null
}

// ---------------------------------------------------------------------------
// STATUS
// ---------------------------------------------------------------------------

function normalizeStatusValue(value: unknown): 'Active' | 'Inactive' {
  if (typeof value === 'boolean') {
    return value ? 'Active' : 'Inactive'
  }

  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (['active', '1', 'true', 'yes'].includes(normalized)) {
    return 'Active'
  }

  if (['inactive', '0', 'false', 'no'].includes(normalized)) {
    return 'Inactive'
  }

  return 'Active'
}

// ---------------------------------------------------------------------------
// MEMBERSHIP
// ---------------------------------------------------------------------------

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

  if (raw === '25') {
    return 'Regular'
  }

  if (raw === '50') {
    return 'Premium'
  }

  return value?.trim() ?? ''
}

// ---------------------------------------------------------------------------
// NAME
// ---------------------------------------------------------------------------

function getFullName(
  firstName: string,
  middleName?: string | null,
  lastName?: string | null
): string {
  return [firstName, middleName, lastName]
    .map(value => value?.trim())
    .filter(Boolean)
    .join(' ')
}

function splitImportedName(value: string): {
  firstName: string
  middleName: string | null
  lastName: string
} {
  const parts = value.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return {
      firstName: '',
      middleName: null,
      lastName: '',
    }
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      middleName: null,
      lastName: '',
    }
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      middleName: null,
      lastName: parts[1],
    }
  }

  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(' '),
    lastName: parts[parts.length - 1],
  }
}

// ---------------------------------------------------------------------------
// CREATE DATA
// ---------------------------------------------------------------------------

function buildMemberCreateData(
  payload: MemberPayload,
  createdById?: number | null
): Prisma.MemberCreateInput {
  const status = normalizeStatusValue(payload.status)

  return {
    firstName: payload.firstName.trim(),

    middleName: payload.middleName?.trim() || null,

    lastName: payload.lastName.trim(),

    membership: normalizeMembershipValue(payload.membership),

    age: payload.age,

    address: payload.address.trim(),

    status,

    isDeleted: false,

    civilStatus: payload.civilStatus ?? null,

    clientId: payload.clientId ?? null,

    transactionDate: payload.transactionDate ?? new Date(),

    dateOfBirth: payload.dateOfBirth ?? null,

    loanCycle: payload.loanCycle ?? null,

    statusChangedAt: status === 'Inactive' ? (payload.statusChangedAt ?? new Date()) : null,

    ...(createdById
      ? {
          createdBy: {
            connect: {
              id: createdById,
            },
          },
        }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// UPDATE DATA
// ---------------------------------------------------------------------------

function buildMemberUpdateData(payload: Partial<MemberPayload>): Prisma.MemberUpdateInput {
  const data: Prisma.MemberUpdateInput = {}

  if (typeof payload.firstName === 'string') {
    data.firstName = payload.firstName.trim()
  }

  if (payload.middleName !== undefined) {
    data.middleName = payload.middleName?.trim() || null
  }

  if (typeof payload.lastName === 'string') {
    data.lastName = payload.lastName.trim()
  }

  if (typeof payload.membership === 'string') {
    data.membership = normalizeMembershipValue(payload.membership)
  }

  if (typeof payload.age === 'number') {
    data.age = payload.age
  }

  if (typeof payload.address === 'string') {
    data.address = payload.address.trim()
  }

  if (typeof payload.status === 'string') {
    const status = normalizeStatusValue(payload.status)

    data.status = status

    data.statusChangedAt = status === 'Inactive' ? (payload.statusChangedAt ?? new Date()) : null
  }

  if (payload.civilStatus !== undefined) {
    data.civilStatus = payload.civilStatus
  }

  if (payload.clientId !== undefined) {
    data.clientId = payload.clientId
  }

  if (payload.transactionDate !== undefined) {
    data.transactionDate = payload.transactionDate
  }

  if (payload.dateOfBirth !== undefined) {
    data.dateOfBirth = payload.dateOfBirth
  }

  if (payload.loanCycle !== undefined) {
    data.loanCycle = payload.loanCycle
  }

  if (payload.statusChangedAt !== undefined) {
    data.statusChangedAt = payload.statusChangedAt
  }

  return data
}

// ---------------------------------------------------------------------------
// MAP MEMBER
// ---------------------------------------------------------------------------

function mapMember(member: Member) {
  return {
    id: member.id,

    firstName: member.firstName,
    middleName: member.middleName,
    lastName: member.lastName,

    fullName: getFullName(member.firstName, member.middleName, member.lastName),

    membership: member.membership,

    membershipLabel: getMembershipLabel(member.membership),

    age: member.age,
    address: member.address,

    status: member.status,

    isDeleted: member.isDeleted,

    visibility: member.isDeleted ? 'hidden' : 'active',

    civilStatus: member.civilStatus,

    clientId: member.clientId,

    transactionDate: member.transactionDate,

    dateOfBirth: member.dateOfBirth,

    loanCycle: member.loanCycle,

    statusChangedAt: member.statusChangedAt,
  }
}

// ---------------------------------------------------------------------------
// LIST MEMBERS
// ---------------------------------------------------------------------------

export async function listMembers(params: MemberListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))

  const requestedPageSize = Number(params.pageSize ?? 10)

  const pageSize =
    Number.isFinite(requestedPageSize) && requestedPageSize > 0 ? requestedPageSize : 10

  const search = params.search?.trim() ?? ''

  const branch = params.branch?.trim() ?? ''

  const actor = await getCurrentActor()

  if (!actor) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
    }
  }

  // --------------------------------------------------
  // STATUS / VISIBILITY
  // --------------------------------------------------

  const requestedStatus: MemberStatusFilter = params.status ?? 'active'

  const status: MemberStatusFilter = actor.role === 'SUPER_ADMIN' ? requestedStatus : 'active'

  // --------------------------------------------------
  // OWNERSHIP
  // --------------------------------------------------

  const ownershipFilter: Prisma.MemberWhereInput | null =
    actor.role === 'SUPER_ADMIN'
      ? null
      : actor.role === 'FINANCE' || actor.role === 'BRANCH_MANAGER'
        ? {
            createdById: actor.id,
          }
        : {
            id: -1,
          }

  // --------------------------------------------------
  // VISIBILITY
  // --------------------------------------------------

  const visibilityFilter: Prisma.MemberWhereInput =
    status === 'active'
      ? {
          isDeleted: false,
        }
      : status === 'hidden'
        ? {
            isDeleted: true,
          }
        : {}

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchFilter: Prisma.MemberWhereInput = search
    ? {
        OR: [
          {
            firstName: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            middleName: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            membership: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            address: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            status: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {}

  // --------------------------------------------------
  // BRANCH
  // --------------------------------------------------

  const branchFilter: Prisma.MemberWhereInput =
    branch && branch !== 'all'
      ? {
          address: {
            contains: branch,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {}

  // --------------------------------------------------
  // WHERE
  // --------------------------------------------------

  const where: Prisma.MemberWhereInput = {
    AND: [ownershipFilter ?? {}, searchFilter, branchFilter, visibilityFilter],
  }

  // --------------------------------------------------
  // QUERY
  // --------------------------------------------------

  const shouldFetchAll = params.all === true

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where,

      orderBy: {
        createdAt: 'desc',
      },

      ...(shouldFetchAll
        ? {}
        : {
            skip: (page - 1) * pageSize,

            take: pageSize,
          }),
    }),

    prisma.member.count({
      where,
    }),
  ])

  return {
    items: items.map(mapMember),
    total,

    page: shouldFetchAll ? 1 : page,

    pageSize: shouldFetchAll ? total : pageSize,
  }
}

// ---------------------------------------------------------------------------
// GET MEMBER
// ---------------------------------------------------------------------------

export async function getMember(id: number) {
  const member = await prisma.member.findUnique({
    where: {
      id,
    },
  })

  return member ? mapMember(member) : null
}

// ---------------------------------------------------------------------------
// CREATE MEMBER
// ---------------------------------------------------------------------------

export async function createMember(payload: MemberPayload) {
  const actor = await getCurrentActor()

  const member = await prisma.member.create({
    data: buildMemberCreateData(payload, actor?.id),
  })

  await createActivityLog({
    type: 'created',
    title: 'Member Created',
    description: 'was added as a new member',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: actor?.name ?? 'System',
    actionLabel: 'Created by',
    memberId: member.id,
  })

  return mapMember(member)
}

// ---------------------------------------------------------------------------
// COMBINED MEMBER TYPES
// ---------------------------------------------------------------------------

export interface CombinedMemberPayload {
  principal: {
    firstName: string
    middleName: string
    lastName: string
    address: string
    birthday: string
    age: string
    civilStatus: string
    weeklyContribution: string
    transactionDate?: Date | null
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
  gender: string
  relationship: string
}

interface DependentInput {
  name: string
  address: string
  birthday: string
  gender: string
}

// ---------------------------------------------------------------------------
// MEMBERSHIP FROM CONTRIBUTION
// ---------------------------------------------------------------------------

function membershipFromContribution(weeklyContribution: string): string {
  const amount = Number(weeklyContribution)

  return Number.isFinite(amount) && amount >= 50 ? '50' : '25'
}

// ---------------------------------------------------------------------------
// CREATE WITH RELATIONS
// ---------------------------------------------------------------------------

export async function createMemberWithRelations(payload: CombinedMemberPayload) {
  const actor = await getCurrentActor()

  const member = await prisma.$transaction(async tx => {
    return tx.member.create({
      data: {
        firstName: payload.principal.firstName,

        middleName: payload.principal.middleName?.trim() || null,

        lastName: payload.principal.lastName,

        address: payload.principal.address,

        age: Number(payload.principal.age),

        membership: membershipFromContribution(payload.principal.weeklyContribution),

        status: 'Active',

        isDeleted: false,

        transactionDate: payload.principal.transactionDate ?? new Date(),

        statusChangedAt: null,

        civilStatus: payload.principal.civilStatus,

        ...(actor?.id
          ? {
              createdBy: {
                connect: {
                  id: actor.id,
                },
              },
            }
          : {}),

        beneficiaries: {
          create: [
            {
              role: 'primary',
              name: payload.beneficiaries.primary.name,
              address: payload.beneficiaries.primary.address,
              birthday: payload.beneficiaries.primary.birthday,
              gender: payload.beneficiaries.primary.gender,
              relationship: payload.beneficiaries.primary.relationship,
            },
            {
              role: 'secondary',
              name: payload.beneficiaries.secondary.name,
              address: payload.beneficiaries.secondary.address,
              birthday: payload.beneficiaries.secondary.birthday,
              gender: payload.beneficiaries.secondary.gender,
              relationship: payload.beneficiaries.secondary.relationship,
            },
          ],
        },

        dependents: {
          create: payload.dependents.map(dependent => ({
            name: dependent.name,
            address: dependent.address,
            birthday: dependent.birthday,
            gender: dependent.gender,
          })),
        },
      },

      include: {
        beneficiaries: true,
        dependents: true,
      },
    })
  })

  await createActivityLog({
    type: 'created',
    title: 'Member Created',
    description: 'was added as a new member, with beneficiaries and dependents',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: actor?.name ?? 'System',
    actionLabel: 'Created by',
    memberId: member.id,
  })

  return member
}

// ---------------------------------------------------------------------------
// UPDATE MEMBER
// ---------------------------------------------------------------------------

export async function updateMember(id: number, payload: Partial<MemberPayload>) {
  const member = await prisma.member.update({
    where: {
      id,
    },

    data: buildMemberUpdateData(payload),
  })

  await createActivityLog({
    type: 'updated',
    title: 'Member Updated',
    description: 'member information was updated',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    memberId: member.id,
  })

  return mapMember(member)
}

// ---------------------------------------------------------------------------
// HIDE
// ---------------------------------------------------------------------------

export async function deleteMember(id: number) {
  const member = await prisma.member.update({
    where: {
      id,
    },

    data: {
      isDeleted: true,
    },
  })

  await createActivityLog({
    type: 'updated',
    title: 'Member Hidden',
    description: 'member was hidden from the active member list',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Hidden by',
    memberId: member.id,
  })

  return mapMember(member)
}

// ---------------------------------------------------------------------------
// RESTORE
// ---------------------------------------------------------------------------

export async function restoreMember(id: number) {
  const member = await prisma.member.update({
    where: {
      id,
    },

    data: {
      isDeleted: false,
    },
  })

  await createActivityLog({
    type: 'updated',
    title: 'Member Restored',
    description: 'member was restored to the active member list',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Restored by',
    memberId: member.id,
  })

  return mapMember(member)
}

// ---------------------------------------------------------------------------
// UPDATE MEMBER PROFILE
// ---------------------------------------------------------------------------

export interface UpdateMemberProfilePayload {
  principal: {
    firstName: string
    middleName?: string | null
    lastName: string

    address: string
    age: number
    membership: string
    civilStatus?: string | null

    /**
     * Database status.
     * Active / Inactive
     */
    status: string

    /**
     * Database visibility.
     * false = visible
     * true = hidden
     */
    isDeleted: boolean
  }

  beneficiaries: {
    primary: {
      name: string
      address: string
      birthday: string
      gender: string
      relationship: string
    } | null

    secondary: {
      name: string
      address: string
      birthday: string
      gender: string
      relationship: string
    } | null
  }

  dependents: {
    id: number
    name: string
    address: string
    birthday: string
    gender: string
  }[]
}

export async function updateMemberProfile(id: number, payload: UpdateMemberProfilePayload) {
  const actor = await getCurrentActor()

  const result = await prisma.$transaction(async tx => {
    // ------------------------------------------------
    // MEMBER
    // ------------------------------------------------

    await tx.member.update({
      where: {
        id,
      },

      data: {
        firstName: payload.principal.firstName.trim(),

        middleName: payload.principal.middleName?.trim() || null,

        lastName: payload.principal.lastName.trim(),

        address: payload.principal.address.trim(),

        age: Number(payload.principal.age),

        membership: normalizeMembershipValue(payload.principal.membership),

        civilStatus: payload.principal.civilStatus ?? null,

        status: normalizeStatusValue(payload.principal.status),

        isDeleted: Boolean(payload.principal.isDeleted),

        statusChangedAt:
          normalizeStatusValue(payload.principal.status) === 'Inactive' ? new Date() : null,
      },
    })

    // ------------------------------------------------
    // PRIMARY BENEFICIARY
    // ------------------------------------------------

    if (payload.beneficiaries.primary) {
      const primary = payload.beneficiaries.primary

      const existing = await tx.beneficiary.findFirst({
        where: {
          memberId: id,
          role: 'primary',
        },
      })

      if (existing) {
        await tx.beneficiary.update({
          where: {
            id: existing.id,
          },

          data: {
            name: primary.name,
            address: primary.address,
            birthday: primary.birthday,
            gender: primary.gender,
            relationship: primary.relationship,
          },
        })
      } else {
        await tx.beneficiary.create({
          data: {
            memberId: id,
            role: 'primary',
            name: primary.name,
            address: primary.address,
            birthday: primary.birthday,
            gender: primary.gender,
            relationship: primary.relationship,
          },
        })
      }
    }

    // ------------------------------------------------
    // SECONDARY BENEFICIARY
    // ------------------------------------------------

    if (payload.beneficiaries.secondary) {
      const secondary = payload.beneficiaries.secondary

      const existing = await tx.beneficiary.findFirst({
        where: {
          memberId: id,
          role: 'secondary',
        },
      })

      if (existing) {
        await tx.beneficiary.update({
          where: {
            id: existing.id,
          },

          data: {
            name: secondary.name,
            address: secondary.address,
            birthday: secondary.birthday,
            gender: secondary.gender,
            relationship: secondary.relationship,
          },
        })
      } else {
        await tx.beneficiary.create({
          data: {
            memberId: id,
            role: 'secondary',
            name: secondary.name,
            address: secondary.address,
            birthday: secondary.birthday,
            gender: secondary.gender,
            relationship: secondary.relationship,
          },
        })
      }
    }

    // ------------------------------------------------
    // DEPENDENTS
    // ------------------------------------------------

    for (const dependent of payload.dependents) {
      await tx.dependent.updateMany({
        where: {
          id: dependent.id,
          memberId: id,
        },

        data: {
          name: dependent.name,
          address: dependent.address,
          birthday: dependent.birthday,
          gender: dependent.gender,
        },
      })
    }

    // ------------------------------------------------
    // GET UPDATED PROFILE
    // ------------------------------------------------

    return tx.member.findUnique({
      where: {
        id,
      },

      include: {
        beneficiaries: true,
        dependents: true,
      },
    })
  })

  if (!result) {
    throw new Error('Member not found')
  }

  await createActivityLog({
    type: 'updated',
    title: 'Member Profile Updated',
    description: 'member information, beneficiaries, and dependents were updated',
    subjectName: getFullName(result.firstName, result.middleName, result.lastName),
    actorName: actor?.name ?? 'System',
    actionLabel: 'Updated by',
    memberId: result.id,
  })

  return getMemberProfile(result.id)
}

// ---------------------------------------------------------------------------
// GET MEMBER PROFILE
// ---------------------------------------------------------------------------

export async function getMemberProfile(id: number) {
  const member = await prisma.member.findUnique({
    where: {
      id,
    },

    include: {
      beneficiaries: true,
      dependents: true,
    },
  })

  if (!member) {
    return null
  }

  const primary = member.beneficiaries.find(beneficiary => beneficiary.role === 'primary')

  const secondary = member.beneficiaries.find(beneficiary => beneficiary.role === 'secondary')

  return {
    principal: {
      id: member.id,

      firstName: member.firstName,

      middleName: member.middleName,

      lastName: member.lastName,

      fullName: getFullName(member.firstName, member.middleName, member.lastName),

      address: member.address,

      age: member.age,

      membership: member.membership,

      membershipLabel: getMembershipLabel(member.membership),

      status: member.status,

      isDeleted: member.isDeleted,

      visibility: member.isDeleted ? 'hidden' : 'active',

      civilStatus: member.civilStatus,

      clientId: member.clientId,

      transactionDate: member.transactionDate,

      dateOfBirth: member.dateOfBirth,

      loanCycle: member.loanCycle,

      statusChangedAt: member.statusChangedAt,

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

    dependents: member.dependents.map(dependent => ({
      id: dependent.id,
      name: dependent.name,
      address: dependent.address,
      birthday: dependent.birthday,
      gender: dependent.gender,
    })),
  }
}

// ---------------------------------------------------------------------------
// IMPORT
// ---------------------------------------------------------------------------

export interface ImportMembersResult {
  importedCount: number
  skippedCount: number
  errors: {
    row: number
    message: string
  }[]
}

// ---------------------------------------------------------------------------
// DATE
// ---------------------------------------------------------------------------

function parseDateCell(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = new Date(value)

    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// IMPORT ROW
// ---------------------------------------------------------------------------

function parseMemberRow(
  row: Record<string, unknown>,
  rowNumber: number,
  errors: {
    row: number
    message: string
  }[]
): MemberPayload | null {
  const importedName = String(row['Client name'] ?? '').trim()

  const { firstName, middleName, lastName } = splitImportedName(importedName)

  const age = Number(row['Client age'])

  const branch = String(row['Branch'] ?? '').trim()

  const area = String(row['AREA'] ?? '').trim()

  const address = [area, branch].filter(Boolean).join(' - ')

  const membershipType = row['Membership Type']

  const totalPayment = row['Total payment amount']

  const membershipSource =
    membershipType && String(membershipType).trim() !== '' ? membershipType : totalPayment

  const clientIdValue = Number(row['Client ID'])

  const transactionDate = parseDateCell(row['Transaction date'])

  const dateOfBirth = parseDateCell(row['Client date of birth date'])

  const loanCycleValue = Number(row['Loan Cycle'])

  if (!firstName || !lastName) {
    errors.push({
      row: rowNumber,
      message: 'Client name must contain at least a first name and last name.',
    })

    return null
  }

  if (!Number.isFinite(age) || age <= 0) {
    errors.push({
      row: rowNumber,
      message: 'Invalid or missing Client age.',
    })

    return null
  }

  if (!address) {
    errors.push({
      row: rowNumber,
      message: 'Missing Branch/AREA.',
    })

    return null
  }

  return {
    firstName,
    middleName,
    lastName,

    membership: normalizeMembershipValue(String(membershipSource ?? '')),

    age,
    address,

    status: 'Active',

    clientId: Number.isFinite(clientIdValue) ? clientIdValue : null,

    transactionDate,

    dateOfBirth,

    loanCycle: Number.isFinite(loanCycleValue) ? loanCycleValue : null,

    statusChangedAt: null,
  }
}

// ---------------------------------------------------------------------------
// IMPORT MEMBERS
// ---------------------------------------------------------------------------

export async function importMembers(rows: Record<string, unknown>[]): Promise<ImportMembersResult> {
  const actor = await getCurrentActor()

  const errors: {
    row: number
    message: string
  }[] = []

  const validPayloads: MemberPayload[] = []

  rows.forEach((row, index) => {
    const payload = parseMemberRow(row, index + 2, errors)

    if (payload) {
      validPayloads.push(payload)
    }
  })

  if (validPayloads.length === 0) {
    return {
      importedCount: 0,
      skippedCount: rows.length,
      errors,
    }
  }

  const result = await prisma.member.createMany({
    data: validPayloads.map(payload => ({
      firstName: payload.firstName,

      middleName: payload.middleName ?? null,

      lastName: payload.lastName,

      membership: normalizeMembershipValue(payload.membership),

      age: payload.age,

      address: payload.address,

      status: 'Active',

      civilStatus: payload.civilStatus ?? null,

      clientId: payload.clientId ?? null,

      transactionDate: payload.transactionDate ?? new Date(),

      dateOfBirth: payload.dateOfBirth ?? null,

      loanCycle: payload.loanCycle ?? null,

      statusChangedAt: null,

      createdById: actor?.id ?? null,

      isDeleted: false,
    })),

    skipDuplicates: true,
  })

  if (result.count > 0) {
    await createActivityLog({
      type: 'created',
      title: 'Members Imported',
      description: `${result.count} member${result.count === 1 ? '' : 's'} imported`,
      subjectName: 'Members',
      actorName: await getCurrentActorName(),
      actionLabel: 'Imported by',
    })
  }

  return {
    importedCount: result.count,

    skippedCount: rows.length - result.count,

    errors,
  }
}
