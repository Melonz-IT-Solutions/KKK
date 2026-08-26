import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/auth/session-provider'
import SessionTimeout from '@/components/auth/session-timeout'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? 'KKK',
  description: 'Kapuso, Kasali, Kasalo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.className} ${inter.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AuthSessionProvider>
          <SessionTimeout />
          {children}
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
