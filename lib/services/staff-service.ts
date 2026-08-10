import { hash } from 'bcrypt'

import { prisma } from '@/lib/prisma'

import { Prisma, type Staff } from '@prisma/client'

import type { StaffRole, StaffStatus } from '@/types/accountfield'

import { createActivityLog } from '@/lib/services/activity-log-service'

// -----------------------------------------------------------------------------
// Staff List
// -----------------------------------------------------------------------------

export interface StaffListParams {
  search?: string
  page?: number
  pageSize?: number
  branch?: string
}

// -----------------------------------------------------------------------------
// Staff Payload
// -----------------------------------------------------------------------------

export interface StaffPayload {
  name: string
  email: string
  username: string
  department: string
  branch?: string
  contactNo?: string
  password?: string
  active?: boolean
  role?: string
}

// -----------------------------------------------------------------------------
// Normalize Staff Role
// -----------------------------------------------------------------------------

const normalizeStaffRole = (role?: string): StaffRole => {
  if (!role) {
    return 'STAFF'
  }

  const normalized = role.toUpperCase().replace(/-/g, '_')

  if (normalized === 'SUPER_ADMIN') {
    return 'SUPER_ADMIN'
  }

  if (normalized === 'FINANCE') {
    return 'FINANCE'
  }

  if (normalized === 'BRANCH_MANAGER') {
    return 'BRANCH_MANAGER'
  }

  return 'STAFF'
}

// -----------------------------------------------------------------------------
// Map Staff
// -----------------------------------------------------------------------------

function mapStaff(
  staff: Staff & {
    user?: {
      roles: string
      departments: string[]
    } | null
  }
) {
  return {
    id: staff.id,

    name: staff.name,

    email: staff.email,

    department: staff.department,

    createdAt: staff.createdAt.toISOString(),

    role: normalizeStaffRole(staff.user?.roles ?? staff.role),

    status: staff.active ? ('ACTIVE' as StaffStatus) : ('INACTIVE' as StaffStatus),

    branch: staff.user?.departments?.[0] ?? staff.branch ?? staff.department,
  }
}

// -----------------------------------------------------------------------------
// List Staff
// -----------------------------------------------------------------------------

export async function listStaff(params: StaffListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))

  const pageSize = Math.max(1, Math.min(5000, Number(params.pageSize ?? 10)))

  const search = params.search?.trim() ?? ''

  const where: Prisma.StaffWhereInput =
    search || params.branch
      ? {
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
                  ],
                }
              : undefined,

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
                      department: {
                        contains: params.branch,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },

                    {
                      user: {
                        departments: {
                          has: params.branch,
                        },
                      },
                    },
                  ],
                }
              : undefined,
          ].filter(Boolean) as Prisma.StaffWhereInput[],
        }
      : {}

  const [items, total] = await Promise.all([
    prisma.staff.findMany({
      where,

      include: {
        user: {
          select: {
            roles: true,
            departments: true,
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

// -----------------------------------------------------------------------------
// Create Staff
// -----------------------------------------------------------------------------

export async function createStaff(payload: StaffPayload) {
  if (!payload.password) {
    throw new Error('Password is required')
  }

  const passwordHash = await hash(payload.password, 10)

  // New accounts always start as Staff User. A Super Admin can change the
  // role later through the separately protected role-management action.
  const role: StaffRole = 'STAFF'

  const staff = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: passwordHash,
        contactNo: payload.contactNo,
        roles: role,
        active: payload.active ?? true,
        departments: [payload.branch ?? payload.department],
      },
    })

    return tx.staff.create({
      data: {
        name: payload.name,
        email: payload.email,
        department: payload.department,
        branch: payload.branch,
        password: passwordHash,
        role,
        active: payload.active ?? true,
        userId: user.id,
      },
    })
  })

  // ---------------------------------------------------------------------------
  // Activity Log
  // ---------------------------------------------------------------------------

  await createActivityLog({
    type: 'created',

    title: 'New Staff Created',

    description: 'was added to the staff system',

    subjectName: staff.name,

    actorName: 'Super Admin',

    actionLabel: 'Created by',

    staffId: staff.id,
  })

  return mapStaff(staff)
}

// -----------------------------------------------------------------------------
// Update Staff
// -----------------------------------------------------------------------------

export async function updateStaff(id: number, payload: Partial<StaffPayload>) {
  const updateData: Prisma.StaffUpdateInput = {}

  if (typeof payload.name === 'string') {
    updateData.name = payload.name
  }

  if (typeof payload.email === 'string') {
    updateData.email = payload.email
  }

  if (typeof payload.department === 'string') {
    updateData.department = payload.department
  }

  if (typeof payload.active === 'boolean') {
    updateData.active = payload.active
  }

  if (payload.password) {
    updateData.password = await hash(payload.password, 10)
  }

  if (payload.role) {
    updateData.role = normalizeStaffRole(payload.role)
  }

  const staff = await prisma.staff.update({
    where: {
      id,
    },

    data: updateData,
  })

  // ---------------------------------------------------------------------------
  // Update linked User role
  // ---------------------------------------------------------------------------

  if (payload.role) {
    const existingStaff = await prisma.staff.findUnique({
      where: {
        id,
      },

      select: {
        userId: true,
      },
    })

    if (existingStaff?.userId) {
      await prisma.user.update({
        where: {
          id: existingStaff.userId,
        },

        data: {
          roles: normalizeStaffRole(payload.role),
        },
      })
    }
  }

  // ---------------------------------------------------------------------------
  // Activity Log
  // ---------------------------------------------------------------------------

  await createActivityLog({
    type: 'updated',

    title: 'Staff Updated',

    description: 'staff information was updated',

    subjectName: staff.name,

    actorName: 'Super Admin',

    actionLabel: 'Updated by',

    staffId: staff.id,
  })

  return mapStaff(
    staff as Staff & {
      user?: null
    }
  )
}

// -----------------------------------------------------------------------------
// Delete Staff
// -----------------------------------------------------------------------------

export async function deleteStaff(id: number) {
  const staff = await prisma.staff.findUnique({
    where: {
      id,
    },
  })

  if (!staff) {
    throw new Error('Staff not found')
  }

  await prisma.staff.delete({
    where: {
      id,
    },
  })
}
