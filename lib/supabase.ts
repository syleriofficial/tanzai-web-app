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
import { type NextRequest, type NextResponse as NextResponseType } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createBrowserClient() {
  return _createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export async function createServerClient() {
  const { cookies } = await import('next/headers')
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
          // Middleware refreshes the session when Server Components cannot mutate cookies.
        }
      },
    },
  })
}

export async function createMiddlewareClient(request: NextRequest) {
  const { NextResponse } = await import('next/server')

  let response = NextResponse.next({ request })

  const supabase = _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  return { supabase, response: response as NextResponseType }
}

export const supabase = createBrowserClient()
