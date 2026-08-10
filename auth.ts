import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { isStaffRole } from '@/lib/auth/permissions'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const username = String(credentials?.username ?? '')
        const password = String(credentials?.password ?? '')

        if (!username || !password) return null

        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            staff: {
              select: { branch: true },
            },
          },
        })

        if (!user || !user.active || user.isDeleted || !isStaffRole(user.roles)) {
          return null
        }

        const passwordMatches = await compare(password, user.password)
        if (!passwordMatches) return null

        return {
          id: String(user.id),
          name: user.name ?? '',
          email: user.email,
          role: user.roles,
          branch: user.staff?.branch ?? null,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.branch = user.branch
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role ?? 'STAFF'
        session.user.branch = token.branch ?? null
      }

      return session
    },
  },

  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})
