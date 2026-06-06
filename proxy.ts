import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

const PROTECTED_PREFIXES = ['/chat', '/profile', '/settings', '/admin']
const AUTH_ROUTES = ['/login', '/signup']

function redirectWithSupabaseCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url)

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie)
  })

  return redirectResponse
}

export async function proxy(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return redirectWithSupabaseCookies(loginUrl, response)
  }

  if (AUTH_ROUTES.includes(pathname) && user) {
    const chatUrl = request.nextUrl.clone()
    chatUrl.pathname = '/chat'
    return redirectWithSupabaseCookies(chatUrl, response)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
