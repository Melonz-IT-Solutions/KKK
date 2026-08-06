import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { Prisma, type Staff } from '@prisma/client'
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
  department: string
  password?: string
  active?: boolean
  role?: string
}

const normalizeStaffRole = (role?: string): StaffRole => {
  if (!role) return 'STAFF_USER'
  const normalized = role.toUpperCase().replace(/-/g, '_')
  if (normalized === 'SUPER_ADMIN') return 'SUPER_ADMIN'
  if (normalized === 'SYSTEM_MANAGER') return 'SYSTEM_MANAGER'
  return 'STAFF_USER'
}

function mapStaff(staff: Staff & { user?: { roles: string; departments: string[] } | null }) {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    department: staff.department,
    createdAt: staff.createdAt.toISOString(),
    role: normalizeStaffRole(staff.user?.roles),
    status: staff.active ? ('ACTIVE' as StaffStatus) : ('INACTIVE' as StaffStatus),
    branch: staff.user?.departments?.[0] ?? staff.department,
  }
}

export async function listStaff(params: StaffListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))
  const pageSize = Math.max(1, Math.min(100, Number(params.pageSize ?? 10)))
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
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.staff.count({ where }),
  ])

  return {
    items: items.map(mapStaff),
    total,
    page,
    pageSize,
  }
}

export async function createStaff(payload: StaffPayload) {
  const passwordHash = payload.password
    ? await hash(payload.password, 10)
    : await hash('password123', 10)

  const data: Prisma.StaffCreateInput = {
    name: payload.name,
    email: payload.email,
    department: payload.department,
    password: passwordHash,
    active: payload.active ?? true,
  }

  const staff = await prisma.staff.create({ data })
  return mapStaff(staff as Staff & { user?: null })
}

export async function updateStaff(id: number, payload: Partial<StaffPayload>) {
  const updateData: Prisma.StaffUpdateInput = {}

  if (typeof payload.name === 'string') updateData.name = payload.name
  if (typeof payload.email === 'string') updateData.email = payload.email
  if (typeof payload.department === 'string') updateData.department = payload.department
  if (typeof payload.active === 'boolean') updateData.active = payload.active
  if (payload.password) {
    updateData.password = await hash(payload.password, 10)
  }

  const staff = await prisma.staff.update({ where: { id }, data: updateData })

  if (payload.role) {
    const existingStaff = await prisma.staff.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (existingStaff?.userId) {
      await prisma.user.update({
        where: { id: existingStaff.userId },
        data: { roles: payload.role },
      })
    }
  }

  return mapStaff(staff as Staff & { user?: null })
}

export async function deleteStaff(id: number) {
  await prisma.staff.delete({ where: { id } })
}
