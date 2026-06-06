/**
 * middleware.ts  (project root — sibling of next.config.js)
 *
 * Runs on every matched request BEFORE the page/route handler.
 *
 * Responsibilities:
 *   1. Refresh the Supabase session (rotates the access token when it expires
 *      and writes the refreshed cookies to the response so the browser stays
 *      logged in without any user action).
 *   2. Protect /chat, /profile, /settings, /admin — redirect to /login when
 *      there is no active session.
 *   3. Redirect authenticated users away from /login and /signup → /chat.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

// Routes that require a logged-in user.
const PROTECTED_PREFIXES = ['/chat', '/profile', '/settings', '/admin']

// Routes that logged-in users should not see.
const AUTH_ROUTES = ['/login', '/signup']

function redirectWithSupabaseCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url)

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request)

  // IMPORTANT: always call getUser() (not getSession()) in middleware.
  // getSession() reads the JWT from the cookie without validating it with the
  // Supabase server, so it can return a stale session. getUser() makes a
  // network call to validate the token and will refresh it if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect private routes.
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return redirectWithSupabaseCookies(loginUrl, response)
  }

  // Redirect authenticated users away from auth pages.
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  if (isAuthRoute && user) {
    const chatUrl = request.nextUrl.clone()
    chatUrl.pathname = '/chat'
    return redirectWithSupabaseCookies(chatUrl, response)
  }

  // Return the response with (potentially refreshed) cookies attached.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - public assets (svg, png, jpg, etc.)
     *   - api routes (they handle auth themselves)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
