import type { DefaultSession } from 'next-auth'
import type { StaffRole } from '@/lib/auth/permissions'

declare module 'next-auth' {
  interface User {
    username: string
    role: StaffRole
    branch: string | null
    mustChangePassword: boolean
  }

  interface Session {
    user: DefaultSession['user'] & {
      id: string
      username: string
      role: StaffRole
      branch: string | null
      mustChangePassword: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string
    role?: StaffRole
    branch?: string | null
    mustChangePassword?: boolean
  }
}
