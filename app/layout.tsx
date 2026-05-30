import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import { SessionProvider } from 'next-auth/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'Kapuso, Kasali, Kasalo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <SessionProvider>
    <html lang="en" className={`${inter.className} ${inter.className} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
    // </SessionProvider>
  )
}
