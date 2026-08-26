// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()

  const isLoginPage = request.nextUrl.pathname === '/login'

  // Already logged in
  // Do not allow the user to stay on /login.
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Login page is public.
  if (isLoginPage) {
    return NextResponse.next()
  }

  // Everything else requires authentication.
  if (!session) {
    const loginUrl = new URL('/login', request.url)

    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
