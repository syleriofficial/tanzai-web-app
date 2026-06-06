/**
 * app/auth/callback/route.ts
 *
 * OAuth / magic-link callback handler.
 *
 * After the user authorises via Google (or any provider), Supabase redirects
 * here with ?code=<pkce_code>.  We exchange that code for a session using the
 * SERVER Supabase client so the session is written into cookies that are
 * readable by both the browser and all Server Components on subsequent
 * requests.
 *
 * Critical fixes vs. the original:
 *   • Uses createServerClient (from @supabase/ssr) instead of the bare
 *     createClient — so the session lands in cookies, not localStorage.
 *   • Forwards the Set-Cookie headers from the Supabase client onto the
 *     redirect response so the browser actually receives the session cookies.
 *   • Handles the `error` query param that Supabase sends when the user
 *     denies consent or the OAuth flow fails.
 *   • Redirects to /chat on success (not /login).
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  const origin = (process.env.SITE_URL || requestUrl.origin).replace(/\/$/, '')

  // OAuth provider returned an error (e.g. user denied consent).
  if (error) {
    console.error('[auth/callback] OAuth error:', error, errorDescription)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', errorDescription ?? error)
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    // No code and no error — unexpected state, redirect to login.
    console.error('[auth/callback] No code in callback URL')
    return NextResponse.redirect(new URL('/login', origin))
  }

  // createServerClient reads + writes cookies via next/headers.
  // The cookies are automatically attached to the response for us.
  const supabase = await createServerClient()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession failed:', exchangeError.message)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', exchangeError.message)
    return NextResponse.redirect(loginUrl)
  }

  // Session is now stored in cookies. Send the user to the app.
  return NextResponse.redirect(new URL('/chat', origin))
}
