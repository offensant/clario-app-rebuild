import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Get the access token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value
    || req.cookies.get('sb-qsahlnjsshubdponqmub-auth-token')?.value

  // Simple session check: if we have an auth cookie, consider the user authenticated
  const hasSession = !!accessToken

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    (p) => req.nextUrl.pathname.startsWith(p)
  )
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding')

  // Redirect unauthenticated users away from protected routes
  if (!hasSession && (isDashboard || isOnboarding)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect authenticated users away from auth pages
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
}
