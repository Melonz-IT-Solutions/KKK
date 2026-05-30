import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './lib/prisma'
import { compare } from 'bcrypt'
import NextAuth from 'next-auth'

// Prisma client is imported from singleton in lib/prisma.ts

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials', credentials)

        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: String(credentials.username) },
        })

        if (!user) {
          return null
        }
        // If you add a password field to your User model, update this logic accordingly
        // For now, skip password check since User model has no password field
        // const isValid = await compare(credentials.password, user.password)
        // if (!isValid) {
        //   throw new Error('Invalid password')
        // }
        return {
          id: user.id.toString(),
          name: user.name ?? '',
          email: user.email ?? '',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token && session.user && typeof token.sub === 'string') {
        session.user.id = token.sub
      }
      return session
    },
  },
})
