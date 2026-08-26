import type { DefaultSession } from 'next-auth'
import type { StaffRole } from '@/lib/auth/permissions'

declare module 'next-auth' {
  interface User {
    username: string
    role: StaffRole
    branch: string | null
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      username: string
      role: StaffRole
      branch: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
    role?: StaffRole
    branch?: string | null
  }
}
