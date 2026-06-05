/**
 * lib/supabase.ts
 *
 * Three Supabase clients for Next.js App Router:
 *   1. createBrowserClient  – used in 'use client' components
 *   2. createServerClient  – used in Server Components, Route Handlers, Server Actions
 *   3. createMiddlewareClient – used in middleware.ts
 *
 * Why @supabase/ssr instead of @supabase/supabase-js directly?
 * The bare createClient stores the session in localStorage, which is
 * unavailable in the Node.js runtime (Server Components / Route Handlers).
 * @supabase/ssr uses cookies so the session is shared between client and
 * server on every request, which is the only way to get persistent auth
 * in the App Router.
 */

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ─── 1. Browser client ────────────────────────────────────────────────────────
// Safe to call at module scope in 'use client' files.
// @supabase/ssr keeps the session in cookies (not localStorage) so it is
// readable server-side on the next request.
export function createBrowserClient() {
  return _createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ─── 2. Server client ─────────────────────────────────────────────────────────
// Must be called inside an async Server Component, Route Handler, or Server
// Action — NOT at module scope — because it reads the request cookies via
// next/headers which is only available during a request.
export async function createServerClient() {
  const cookieStore = await cookies()

  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll is called from a Server Component where cookies cannot be
          // mutated. The middleware will refresh the session so this is safe
          // to ignore.
        }
      },
    },
  })
}

// ─── 3. Middleware client ─────────────────────────────────────────────────────
// Returns both the Supabase client and the (possibly mutated) NextResponse so
// the middleware can forward refreshed cookies to the browser.
export function createMiddlewareClient(request: NextRequest) {
  // Start with a pass-through response; we may set cookies on it below.
  let response = NextResponse.next({ request })

  const supabase = _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // First write the cookies back onto the request (for this request).
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        // Then rebuild the response so the updated cookies reach the browser.
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  return { supabase, response }
}

export const supabase = createBrowserClient()
