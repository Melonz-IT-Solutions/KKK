import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getCurrentActorName } from '@/lib/auth/get-current-user'
import { hashPassword } from '@/lib/auth/password'
import { isStaffRole, type StaffRole } from '@/lib/auth/permissions'
import type { StaffStatus } from '@/types/accountfield'

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
  clientId?: string
  branch?: string
  cluster?: string
  contactNo?: string
  password?: string
  active?: boolean
  role?: StaffRole
}

/* -------------------------------------------------------------------------- */
/* INTERNAL TYPES                                                              */
/* -------------------------------------------------------------------------- */

const userWithAssignments = {
  clusterManagers: { include: { cluster: true }, take: 1 },
  branchManagers: { include: { branch: true }, take: 1 },
} as const

type UserWithAssignments = Prisma.UserGetPayload<{ include: typeof userWithAssignments }>

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

const normalizeStaffRole = (role?: string): StaffRole => {
  if (!role) {
    return 'FDO'
  }

  const normalized = role.toUpperCase().replace(/-/g, '_')

  return isStaffRole(normalized) ? normalized : 'FDO'
}

function mapStaff(user: UserWithAssignments) {
  return {
    id: user.id,
    name: user.name ?? '',
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    role: normalizeStaffRole(user.role),
    status: user.active ? ('ACTIVE' as StaffStatus) : ('INACTIVE' as StaffStatus),
    branch: user.branchManagers[0]?.branch.name ?? '',
    cluster: user.clusterManagers[0]?.cluster.name ?? '',
  }
}

/* -------------------------------------------------------------------------- */
/* STAFF ACTIVITY LOG                                                          */
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
/* LIST STAFF                                                                  */
/* -------------------------------------------------------------------------- */

export async function listStaff(params: StaffListParams = {}) {
  const page = Math.max(1, Number(params.page ?? 1))

  const pageSize = Math.max(1, Number(params.pageSize ?? 10))

  const search = params.search?.trim() ?? ''

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
    role: {
      notIn: ['SUPER_ADMIN'],
    },
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {},

      params.branch
        ? {
            branchManagers: {
              some: {
                branch: {
                  name: { contains: params.branch, mode: Prisma.QueryMode.insensitive },
                },
              },
            },
          }
        : {},
    ],
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: userWithAssignments,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),

    prisma.user.count({ where }),
  ])

  return {
    items: items.map(mapStaff),
    total,
    page,
    pageSize,
  }
}

/* -------------------------------------------------------------------------- */
/* CREATE STAFF                                                                */
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

  let userId: number

  try {
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: passwordHash,
        contactNo: payload.contactNo,
        clientId: payload.clientId,
        role: role,
        department: payload.department,
        active,
        isDeleted: false,
        mustChangePassword: true,
      },
    })

    userId = user.id
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('Username or email already exists')
    }
    throw err
  }

  // Create join table records
  await assignBranchOrCluster(userId, role, payload.branch, payload.cluster)

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: userWithAssignments,
  })

  await createActivityLog({
    type: 'created',
    title: 'New Staff Created',
    description: 'was added to the staff system',
    subjectName: user.name ?? user.username,
    actorName: await getCurrentActorName(),
    actionLabel: 'Created by',
    userId: user.id,
  })

  return mapStaff(user)
}

/* -------------------------------------------------------------------------- */
/* UPDATE STAFF                                                                */
/* -------------------------------------------------------------------------- */

export async function updateStaff(id: number, payload: Partial<StaffPayload>) {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      active: true,
      branchManagers: { include: { branch: true }, take: 1 },
      clusterManagers: { include: { cluster: true }, take: 1 },
    },
  })

  if (!existingUser) {
    throw new Error('Staff not found')
  }

  const normalizedRole = payload.role ? normalizeStaffRole(payload.role) : undefined

  if (normalizedRole === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN cannot be assigned from staff management.')
  }

  const existingBranch = existingUser.branchManagers[0]?.branch.name ?? null
  const existingCluster = existingUser.clusterManagers[0]?.cluster.name ?? null

  const changes: string[] = []

  if (typeof payload.name === 'string' && payload.name !== existingUser.name) {
    changes.push('name')
  }

  if (typeof payload.email === 'string' && payload.email !== existingUser.email) {
    changes.push('email')
  }

  if (typeof payload.department === 'string' && payload.department !== existingUser.department) {
    changes.push('department')
  }

  if (typeof payload.branch === 'string' && (payload.branch || null) !== existingBranch) {
    changes.push('branch')
  }

  if (typeof payload.cluster === 'string' && (payload.cluster || null) !== existingCluster) {
    changes.push('cluster')
  }

  if (typeof payload.active === 'boolean' && payload.active !== existingUser.active) {
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

  await prisma.user.update({
    where: { id },
    data: {
      ...(typeof payload.name === 'string' ? { name: payload.name } : {}),
      ...(typeof payload.email === 'string' ? { email: payload.email } : {}),
      ...(typeof payload.username === 'string' ? { username: payload.username } : {}),
      ...(typeof payload.contactNo === 'string' ? { contactNo: payload.contactNo } : {}),
      ...(typeof payload.department === 'string' ? { department: payload.department } : {}),
      ...(typeof payload.active === 'boolean'
        ? { active: payload.active, isDeleted: !payload.active }
        : {}),
      ...(normalizedRole ? { role: normalizedRole } : {}),
      ...(payload.password ? { password: await hashPassword(payload.password) } : {}),
    },
  })

  // Update join table records when role, branch, or cluster changes
  const roleForAssignment =
    normalizedRole ??
    normalizeStaffRole(
      (await prisma.user.findUniqueOrThrow({ where: { id }, select: { role: true } })).role
    )

  if (normalizedRole || typeof payload.branch === 'string' || typeof payload.cluster === 'string') {
    await assignBranchOrCluster(id, roleForAssignment, payload.branch, payload.cluster)
  }

  const updated = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: userWithAssignments,
  })

  const description = buildStaffUpdateDescription(changes, passwordChanged)

  await createActivityLog({
    type: 'updated',
    title: 'Staff Updated',
    description,
    subjectName: updated.name ?? updated.username,
    actorName: await getCurrentActorName(),
    actionLabel: 'Updated by',
    userId: updated.id,
  })

  return mapStaff(updated)
}

/* -------------------------------------------------------------------------- */
/* DELETE / DEACTIVATE STAFF                                                   */
/* -------------------------------------------------------------------------- */

export async function deleteStaff(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, username: true },
  })

  if (!user) {
    throw new Error('Staff not found')
  }

  await prisma.user.update({
    where: { id },
    data: { active: false, isDeleted: true },
  })

  await createActivityLog({
    type: 'deleted',
    title: 'Staff Deactivated',
    description: 'staff account was deactivated',
    subjectName: user.name ?? user.username,
    actorName: await getCurrentActorName(),
    actionLabel: 'Deactivated by',
    userId: user.id,
  })
}

/* -------------------------------------------------------------------------- */
/* INTERNAL: manage join table assignments                                     */
/* -------------------------------------------------------------------------- */

/**
 * Clears and re-assigns ClusterManager / BranchManager records for a user
 * based on their role and provided names.
 *
 * - CLUSTER_MANAGER + clusterName  → creates ClusterManager record
 * - BRANCH_MANAGER  + branchName   → creates BranchManager record
 * - Role change away from either   → clears the stale record
 */
async function assignBranchOrCluster(
  userId: number,
  role: StaffRole,
  branchName?: string,
  clusterName?: string
) {
  if (role === 'CLUSTER_MANAGER') {
    // Clear any old branch assignment
    await prisma.branchManager.deleteMany({ where: { userId } })

    if (clusterName) {
      const cluster = await prisma.cluster.findUnique({ where: { name: clusterName } })

      if (cluster) {
        // Replace with new cluster (delete first to avoid unique conflict)
        await prisma.clusterManager.deleteMany({ where: { userId } })
        await prisma.clusterManager.create({ data: { userId, clusterId: cluster.id } })
      }
    } else {
      await prisma.clusterManager.deleteMany({ where: { userId } })
    }
  } else if (role === 'BRANCH_MANAGER') {
    // Clear any old cluster assignment
    await prisma.clusterManager.deleteMany({ where: { userId } })

    if (branchName) {
      const branch = await prisma.branch.findUnique({ where: { name: branchName } })

      if (branch) {
        // Replace with new branch (delete first to avoid unique conflict)
        await prisma.branchManager.deleteMany({ where: { userId } })
        await prisma.branchManager.create({ data: { userId, branchId: branch.id } })
      }
    } else {
      await prisma.branchManager.deleteMany({ where: { userId } })
    }
  } else {
    // Any other role — clear both
    await prisma.clusterManager.deleteMany({ where: { userId } })
    await prisma.branchManager.deleteMany({ where: { userId } })
  }
}
