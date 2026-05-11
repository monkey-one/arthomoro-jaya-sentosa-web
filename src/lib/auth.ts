import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { safeJSON } from './utils'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { role: true },
        })
        if (!user || !user.isActive) return null
        const ok = await bcrypt.compare(credentials.password, user.password)
        if (!ok) return null
        await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? null,
          roleName: user.role.name,
          permissions: safeJSON<string[]>(user.role.permissions, []),
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.roleName = (user as any).roleName
        token.permissions = (user as any).permissions || []
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).roleName = token.roleName
        ;(session.user as any).permissions = token.permissions
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function hasPermission(perms: string[] | undefined, key: string) {
  if (!perms) return false
  return perms.includes(key)
}
