import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth' // adjust path if needed

export async function proxy(request: NextRequest) {
  const session = await auth()


  if (!session) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
