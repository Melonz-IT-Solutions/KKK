import type { DefaultSession } from 'next-auth'
import type { StaffRole } from '@/lib/auth/permissions'

declare module 'next-auth' {
  interface User {
    role: StaffRole
    branch: string | null
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: StaffRole
      branch: string | null
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: StaffRole
    branch?: string | null
  }
}
