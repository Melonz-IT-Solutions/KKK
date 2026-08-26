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
      departments: true,
      staff: {
        select: {
          department: true,
          branch: true,
        },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    id: String(user.id),
    name: user.name ?? '',
    email: user.email,

    department: user.staff?.department ?? user.departments[0] ?? '',

    branch: user.staff?.branch ?? user.departments[0] ?? undefined,

    role: user.roles as StaffRole,
  }
}
