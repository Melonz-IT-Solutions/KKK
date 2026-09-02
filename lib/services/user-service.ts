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
      role: true,
      department: true,
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
    role: user.role as StaffRole,
  }
}
