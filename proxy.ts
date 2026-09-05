// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function proxy(request: NextRequest) {
  const session = await auth()

  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/login'
  const isSetupPasswordPage = pathname === '/setup-password'
  const isSetupPasswordApi = pathname.startsWith('/api/setup-password')

  // Already logged in — do not allow the user to stay on /login.
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

    loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search)

    return NextResponse.redirect(loginUrl)
  }

  const mustChangePassword = session.user?.mustChangePassword ?? false

  // Allow the setup-password API through so the form can submit.
  if (isSetupPasswordApi) {
    return NextResponse.next()
  }

  // Force users who must change their password to /setup-password.
  if (mustChangePassword && !isSetupPasswordPage) {
    return NextResponse.redirect(new URL('/setup-password', request.url))
  }

  // Prevent users who already set their password from revisiting /setup-password.
  if (!mustChangePassword && isSetupPasswordPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
