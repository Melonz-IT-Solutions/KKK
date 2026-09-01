import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from '@/lib/prisma'
import { isStaffRole, type StaffRole } from '@/lib/auth/permissions'

import { verifyPassword } from '@/lib/auth/password'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // -------------------------------------------------------------------------
  // HOST
  // -------------------------------------------------------------------------

  trustHost: true,

  // -------------------------------------------------------------------------
  // SESSION
  // -------------------------------------------------------------------------

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },

  // -------------------------------------------------------------------------
  // PROVIDERS
  // -------------------------------------------------------------------------

  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: {
          label: 'Username',
          type: 'text',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },

      // ---------------------------------------------------------------------
      // AUTHORIZE
      // ---------------------------------------------------------------------

      async authorize(credentials) {
        const username = String(credentials?.username ?? '')

        const password = String(credentials?.password ?? '')

        if (!username || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            username,
          },
          include: {
            branchManagers: { include: { branch: true }, take: 1 },
          },
        })

        // -------------------------------------------------------------------
        // ACCOUNT CHECK
        // -------------------------------------------------------------------

        if (!user || !user.active || user.isDeleted || !isStaffRole(user.roles)) {
          return null
        }

        // -------------------------------------------------------------------
        // PASSWORD CHECK
        // -------------------------------------------------------------------

        const passwordMatches = await verifyPassword(password, user.password)

        if (!passwordMatches) {
          return null
        }

        // -------------------------------------------------------------------
        // USER
        // -------------------------------------------------------------------

        return {
          id: String(user.id),

          name: user.name ?? '',

          email: user.email,

          username: user.username,

          role: user.roles,

          branch: user.branchManagers[0]?.branch.name ?? null,
        }
      },
    }),
  ],

  // -------------------------------------------------------------------------
  // CALLBACKS
  // -------------------------------------------------------------------------

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role

        token.branch = user.branch

        token.username = user.username
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        const tokenRole: unknown = token.role

        const role: StaffRole = isStaffRole(tokenRole) ? tokenRole : 'GUEST'

        const branch: string | null = typeof token.branch === 'string' ? token.branch : null

        const username: string = typeof token.username === 'string' ? token.username : ''

        session.user.id = typeof token.sub === 'string' ? token.sub : ''

        session.user.role = role

        session.user.branch = branch

        session.user.username = username
      }

      return session
    },
  },

  // -------------------------------------------------------------------------
  // LOGIN PAGE
  // -------------------------------------------------------------------------

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
})
