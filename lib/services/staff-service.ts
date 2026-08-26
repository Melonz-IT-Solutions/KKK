import { Prisma, type Staff } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { createActivityLog } from '@/lib/services/activity-log-service'

import { getCurrentActorName } from '@/lib/auth/get-current-user'

import { hashPassword } from '@/lib/auth/password'

import type { StaffRole, StaffStatus } from '@/types/accountfield'

export interface StaffListParams {
  search?: string
  page?: number
  pageSize?: number
  branch?: string
}

export interface StaffPayload {
  name: string
  email: string
  username: string
  department: string
  branch?: string
  contactNo?: string
  password?: string
  active?: boolean
  role?: StaffRole
}

const normalizeStaffRole = (role?: string): StaffRole => {
  if (!role) {
    return 'STAFF'
  }

  const normalized = role.toUpperCase().replace(/-/g, '_')

  switch (normalized) {
    case 'SUPER_ADMIN':
      return 'SUPER_ADMIN'

    case 'FINANCE':
      return 'FINANCE'

    case 'BRANCH_MANAGER':
      return 'BRANCH_MANAGER'

    default:
      return 'STAFF'
  }
}

function mapStaff(
  staff: Staff & {
    user?: {
      username: string
      roles: string
      branch: string | null
    } | null
  }
) {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    username: staff.user?.username ?? '',
    department: staff.department,
    createdAt: staff.createdAt.toISOString(),
    role: normalizeStaffRole(staff.user?.roles),
    status: staff.active ? ('ACTIVE' as StaffStatus) : ('INACTIVE' as StaffStatus),
    branch: staff.user?.branch ?? staff.branch ?? undefined,
  }
}

/* -------------------------------------------------------------------------- */
/* STAFF ACTIVITY LOG                                                         */
/* -------------------------------------------------------------------------- */

function buildStaffUpdateDescription(changes: string[], passwordChanged: boolean): string {
  if (changes.length === 0 && !passwordChanged) {
    return 'staff information was updated'
  }

  const allChanges = [...changes]

  if (passwordChanged) {
    allChanges.push('password')
  }

  if (allChanges.length === 1) {
    return `updated ${allChanges[0]}`
  }

  if (allChanges.length === 2) {
    return `updated ${allChanges[0]} and ${allChanges[1]}`
  }

  const lastChange = allChanges[allChanges.length - 1]
  const previousChanges = allChanges.slice(0, -1)

  return `updated ${previousChanges.join(', ')}, and ${lastChange}`
}

/* -------------------------------------------------------------------------- */
/* LIST STAFF                                                                 */
/* -------------------------------------------------------------------------- */

export async function listStaff(params: StaffListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))

  const pageSize = Math.max(1, Number(params.pageSize ?? 10))

  const search = params.search?.trim() ?? ''

  const where: Prisma.StaffWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                email: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                department: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                user: {
                  username: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          }
        : {},

      params.branch
        ? {
            OR: [
              {
                branch: {
                  contains: params.branch,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                user: {
                  branch: {
                    contains: params.branch,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          }
        : {},
    ],
  }

  const [items, total] = await Promise.all([
    prisma.staff.findMany({
      where,

      include: {
        user: {
          select: {
            username: true,
            roles: true,
            branch: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      skip: (page - 1) * pageSize,

      take: pageSize,
    }),

    prisma.staff.count({
      where,
    }),
  ])

  return {
    items: items.map(mapStaff),
    total,
    page,
    pageSize,
  }
}

/* -------------------------------------------------------------------------- */
/* CREATE STAFF                                                               */
/* -------------------------------------------------------------------------- */

export async function createStaff(payload: StaffPayload) {
  if (!payload.password) {
    throw new Error('Password is required')
  }

  if (!payload.role) {
    throw new Error('Role is required')
  }

  const role = normalizeStaffRole(payload.role)

  if (role === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN cannot be assigned from staff creation.')
  }

  const passwordHash = await hashPassword(payload.password)

  const active = payload.active ?? true

  const staff = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: passwordHash,
        contactNo: payload.contactNo,
        roles: role,
        branch: payload.branch || null,
        active,
        isDeleted: false,
        departments: [payload.department],
      },
    })

    return tx.staff.create({
      data: {
        name: payload.name,
        email: payload.email,
        department: payload.department,
        branch: payload.branch || null,
        active,
        userId: user.id,
      },

      include: {
        user: {
          select: {
            username: true,
            roles: true,
            branch: true,
          },
        },
      },
    })
  })

  await createActivityLog({
    type: 'created',

    title: 'New Staff Created',

    description: 'was added to the staff system',

    subjectName: staff.name,

    actorName: await getCurrentActorName(),

    actionLabel: 'Created by',

    staffId: staff.id,
  })

  return mapStaff(staff)
}

/* -------------------------------------------------------------------------- */
/* UPDATE STAFF                                                               */
/* -------------------------------------------------------------------------- */

export async function updateStaff(id: number, payload: Partial<StaffPayload>) {
  const existingStaff = await prisma.staff.findUnique({
    where: { id },

    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      branch: true,
      active: true,
      userId: true,
    },
  })

  if (!existingStaff) {
    throw new Error('Staff not found')
  }

  const normalizedRole = payload.role ? normalizeStaffRole(payload.role) : undefined

  if (normalizedRole === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN cannot be assigned from staff management.')
  }

  /*
   * Track changes BEFORE updating.
   *
   * Password is only recorded as "password".
   * The actual password is NEVER stored in the activity log.
   */
  const changes: string[] = []

  if (typeof payload.name === 'string' && payload.name !== existingStaff.name) {
    changes.push('name')
  }

  if (typeof payload.email === 'string' && payload.email !== existingStaff.email) {
    changes.push('email')
  }

  if (typeof payload.department === 'string' && payload.department !== existingStaff.department) {
    changes.push('department')
  }

  if (typeof payload.branch === 'string' && (payload.branch || null) !== existingStaff.branch) {
    changes.push('branch')
  }

  if (typeof payload.active === 'boolean' && payload.active !== existingStaff.active) {
    changes.push(payload.active ? 'status to Active' : 'status to Inactive')
  }

  if (normalizedRole) {
    changes.push('role')
  }

  if (typeof payload.username === 'string') {
    changes.push('username')
  }

  if (typeof payload.contactNo === 'string') {
    changes.push('contact number')
  }

  const passwordChanged = Boolean(payload.password)

  const updated = await prisma.$transaction(async tx => {
    await tx.staff.update({
      where: { id },

      data: {
        ...(typeof payload.name === 'string'
          ? {
              name: payload.name,
            }
          : {}),

        ...(typeof payload.email === 'string'
          ? {
              email: payload.email,
            }
          : {}),

        ...(typeof payload.department === 'string'
          ? {
              department: payload.department,
            }
          : {}),

        ...(typeof payload.branch === 'string'
          ? {
              branch: payload.branch || null,
            }
          : {}),

        ...(typeof payload.active === 'boolean'
          ? {
              active: payload.active,
            }
          : {}),
      },
    })

    if (existingStaff.userId) {
      await tx.user.update({
        where: {
          id: existingStaff.userId,
        },

        data: {
          ...(typeof payload.name === 'string'
            ? {
                name: payload.name,
              }
            : {}),

          ...(typeof payload.email === 'string'
            ? {
                email: payload.email,
              }
            : {}),

          ...(typeof payload.username === 'string'
            ? {
                username: payload.username,
              }
            : {}),

          ...(typeof payload.contactNo === 'string'
            ? {
                contactNo: payload.contactNo,
              }
            : {}),

          ...(typeof payload.branch === 'string'
            ? {
                branch: payload.branch || null,
              }
            : {}),

          ...(typeof payload.active === 'boolean'
            ? {
                active: payload.active,

                isDeleted: !payload.active,
              }
            : {}),

          ...(normalizedRole
            ? {
                roles: normalizedRole,
              }
            : {}),

          ...(payload.password
            ? {
                password: await hashPassword(payload.password),
              }
            : {}),
        },
      })
    }

    return tx.staff.findUniqueOrThrow({
      where: { id },

      include: {
        user: {
          select: {
            username: true,
            roles: true,
            branch: true,
          },
        },
      },
    })
  })

  /*
   * Create activity log using only safe information.
   */
  const description = buildStaffUpdateDescription(changes, passwordChanged)

  await createActivityLog({
    type: 'updated',

    title: 'Staff Updated',

    description,

    subjectName: updated.name,

    actorName: await getCurrentActorName(),

    actionLabel: 'Updated by',

    staffId: updated.id,
  })

  return mapStaff(updated)
}

/* -------------------------------------------------------------------------- */
/* DELETE / DEACTIVATE STAFF                                                  */
/* -------------------------------------------------------------------------- */

export async function deleteStaff(id: number) {
  const staff = await prisma.staff.findUnique({
    where: { id },

    select: {
      id: true,
      name: true,
      userId: true,
    },
  })

  if (!staff) {
    throw new Error('Staff not found')
  }

  await prisma.$transaction(async tx => {
    await tx.staff.update({
      where: { id },

      data: {
        active: false,
      },
    })

    if (staff.userId) {
      await tx.user.update({
        where: {
          id: staff.userId,
        },

        data: {
          active: false,
          isDeleted: true,
        },
      })
    }
  })

  await createActivityLog({
    type: 'deleted',

    title: 'Staff Deactivated',

    description: 'staff account was deactivated',

    subjectName: staff.name,

    actorName: await getCurrentActorName(),

    actionLabel: 'Deactivated by',

    staffId: staff.id,
  })
}
