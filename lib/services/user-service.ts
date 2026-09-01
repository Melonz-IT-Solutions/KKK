import { prisma } from '@/lib/prisma'
import type { StaffRole } from '@/types/accountfield'

export interface CurrentUser {
  id: string
  name: string
  email: string
  department: string
  branch?: string
  role: StaffRole
}

export async function getUserById(userId: number): Promise<CurrentUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      department: true,
      branch: true,
    },
  })

  if (!user) {
    return null
  }

  return {
    id: String(user.id),
    name: user.name ?? '',
    email: user.email,

    department: user.department ?? '',

    branch: user.branch ?? undefined,

    role: user.roles as StaffRole,
  }
}
