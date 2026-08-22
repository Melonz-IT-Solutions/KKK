import { prisma } from '@/lib/prisma'
import { Prisma, type Member } from '@prisma/client'

import { createActivityLog } from '@/lib/services/activity-log-service'
import { getCurrentActor, getCurrentActorName } from '@/lib/auth/get-current-user'

export type MemberStatusFilter = 'active' | 'hidden' | 'all'

export interface MemberListParams {
  search?: string
  branch?: string
  page?: number
  pageSize?: number
  status?: MemberStatusFilter
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

/* -------------------------------------------------------------------------- */
/* NORMALIZERS                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* NAME HELPERS                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* MEMBER DATA BUILDERS                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* MEMBER MAPPER                                                              */
/* -------------------------------------------------------------------------- */

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

    // Keep the existing active / hidden UI behavior.
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

/* -------------------------------------------------------------------------- */
/* ACTIVITY LOG HELPERS                                                       */
/* -------------------------------------------------------------------------- */

function formatActivityValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return 'empty'
  }

  switch (field) {
    case 'membership':
      return getMembershipLabel(String(value))

    case 'status':
      return String(value)

    case 'isDeleted':
      return Boolean(value) ? 'Inactive' : 'Active'

    case 'civilStatus':
      return String(value)

    case 'age':
      return String(value)

    case 'clientId':
      return String(value)

    case 'loanCycle':
      return String(value)

    case 'address':
      return `"${String(value)}"`

    case 'firstName':
    case 'middleName':
    case 'lastName':
      return `"${String(value)}"`

    case 'dateOfBirth':
    case 'transactionDate':
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }

      return String(value)

    default:
      return String(value)
  }
}

function getChangedMemberFields(before: Member, after: Member): string[] {
  const changes: string[] = []

  const fields: {
    key:
      | 'firstName'
      | 'middleName'
      | 'lastName'
      | 'membership'
      | 'age'
      | 'address'
      | 'status'
      | 'isDeleted'
      | 'civilStatus'
      | 'clientId'
      | 'transactionDate'
      | 'dateOfBirth'
      | 'loanCycle'
    label: string
  }[] = [
    {
      key: 'firstName',
      label: 'first name',
    },
    {
      key: 'middleName',
      label: 'middle name',
    },
    {
      key: 'lastName',
      label: 'last name',
    },
    {
      key: 'membership',
      label: 'membership',
    },
    {
      key: 'age',
      label: 'age',
    },
    {
      key: 'address',
      label: 'address',
    },
    {
      key: 'status',
      label: 'status',
    },
    {
      key: 'isDeleted',
      label: 'status',
    },
    {
      key: 'civilStatus',
      label: 'civil status',
    },
    {
      key: 'clientId',
      label: 'client ID',
    },
    {
      key: 'transactionDate',
      label: 'transaction date',
    },
    {
      key: 'dateOfBirth',
      label: 'date of birth',
    },
    {
      key: 'loanCycle',
      label: 'loan cycle',
    },
  ]

  for (const field of fields) {
    const oldValue = before[field.key]
    const newValue = after[field.key]

    const oldComparable = oldValue instanceof Date ? oldValue.getTime() : oldValue

    const newComparable = newValue instanceof Date ? newValue.getTime() : newValue

    if (oldComparable !== newComparable) {
      changes.push(`${field.label} to ${formatActivityValue(field.key, newValue)}`)
    }
  }

  return changes
}

function buildMemberUpdateDescription(before: Member, after: Member): string {
  const changes = getChangedMemberFields(before, after)

  if (changes.length === 0) {
    return 'member information was updated'
  }

  if (changes.length === 1) {
    return `updated ${changes[0]}`
  }

  if (changes.length === 2) {
    return `updated ${changes[0]} and ${changes[1]}`
  }

  const lastChange = changes[changes.length - 1]
  const previousChanges = changes.slice(0, -1)

  return `updated ${previousChanges.join(', ')}, and ${lastChange}`
}

/* -------------------------------------------------------------------------- */
/* LIST MEMBERS                                                               */
/* -------------------------------------------------------------------------- */

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

  const requestedStatus: MemberStatusFilter = params.status ?? 'active'

  const status: MemberStatusFilter = actor.role === 'SUPER_ADMIN' ? requestedStatus : 'active'

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

  const branchFilter: Prisma.MemberWhereInput =
    branch && branch !== 'all'
      ? {
          address: {
            contains: branch,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {}

  const where: Prisma.MemberWhereInput = {
    AND: [ownershipFilter ?? {}, searchFilter, branchFilter, visibilityFilter],
  }

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

/* -------------------------------------------------------------------------- */
/* GET MEMBER                                                                 */
/* -------------------------------------------------------------------------- */

export async function getMember(id: number) {
  const member = await prisma.member.findUnique({
    where: {
      id,
    },
  })

  return member ? mapMember(member) : null
}

/* -------------------------------------------------------------------------- */
/* CREATE MEMBER                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* CREATE MEMBER WITH RELATIONS                                               */
/* -------------------------------------------------------------------------- */

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

function membershipFromContribution(weeklyContribution: string): string {
  const amount = Number(weeklyContribution)

  return Number.isFinite(amount) && amount >= 50 ? '50' : '25'
}

export async function createMemberWithRelations(payload: CombinedMemberPayload) {
  const actor = await getCurrentActor()

  const member = await prisma.$transaction(async tx => {
    return tx.member.create({
      data: {
        firstName: payload.principal.firstName.trim(),

        middleName: payload.principal.middleName?.trim() || null,

        lastName: payload.principal.lastName.trim(),

        address: payload.principal.address.trim(),

        age: Number(payload.principal.age),

        membership: membershipFromContribution(payload.principal.weeklyContribution),

        status: 'Active',

        isDeleted: false,

        civilStatus: payload.principal.civilStatus,

        dateOfBirth: payload.principal.birthday ? new Date(payload.principal.birthday) : null,

        transactionDate: payload.principal.transactionDate ?? new Date(),

        statusChangedAt: null,

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
    description: 'added a new member',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: actor?.name ?? 'System',
    actionLabel: 'Created by',
    memberId: member.id,
  })

  return member
}

/* -------------------------------------------------------------------------- */
/* UPDATE MEMBER                                                              */
/* -------------------------------------------------------------------------- */

export async function updateMember(id: number, payload: Partial<MemberPayload>) {
  const before = await prisma.member.findUnique({
    where: {
      id,
    },
  })

  if (!before) {
    throw new Error('Member not found')
  }

  const member = await prisma.member.update({
    where: {
      id,
    },
    data: buildMemberUpdateData(payload),
  })

  const description = buildMemberUpdateDescription(before, member)

  await createActivityLog({
    type: 'updated',
    title: 'Member Updated',
    description,
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    memberId: member.id,
  })

  return mapMember(member)
}

/* -------------------------------------------------------------------------- */
/* HIDE MEMBER                                                                */
/* -------------------------------------------------------------------------- */

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
    title: 'Member Updated',
    description: 'updated status to Inactive',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    memberId: member.id,
  })

  return mapMember(member)
}

/* -------------------------------------------------------------------------- */
/* RESTORE MEMBER                                                             */
/* -------------------------------------------------------------------------- */

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
    title: 'Member Updated',
    description: 'updated status to Active',
    subjectName: getFullName(member.firstName, member.middleName, member.lastName),
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    memberId: member.id,
  })

  return mapMember(member)
}

/* -------------------------------------------------------------------------- */
/* UPDATE MEMBER PROFILE                                                      */
/* -------------------------------------------------------------------------- */

export interface UpdateMemberProfilePayload {
  principal: {
    firstName: string
    middleName?: string | null
    lastName: string
    address: string
    age: number
    membership: string
    civilStatus?: string | null
    status: string
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

  const before = await prisma.member.findUnique({
    where: {
      id,
    },
  })

  if (!before) {
    throw new Error('Member not found')
  }

  const result = await prisma.$transaction(async tx => {
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

  const description = buildMemberUpdateDescription(before, result)

  await createActivityLog({
    type: 'updated',
    title: 'Member Updated',
    description,
    subjectName: getFullName(result.firstName, result.middleName, result.lastName),
    actorName: actor?.name ?? 'System',
    actionLabel: 'Updated by',
    memberId: result.id,
  })

  return getMemberProfile(result.id)
}

/* -------------------------------------------------------------------------- */
/* GET MEMBER PROFILE                                                         */
/* -------------------------------------------------------------------------- */

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

      // Keep UI value as active / hidden.
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

/* -------------------------------------------------------------------------- */
/* IMPORT MEMBERS                                                             */
/* -------------------------------------------------------------------------- */

export interface ImportMembersResult {
  importedCount: number

  skippedCount: number

  errors: {
    row: number
    message: string
  }[]
}

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
