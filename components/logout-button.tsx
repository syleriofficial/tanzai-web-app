'use client'

/**
 * components/logout-button.tsx
 *
 * Signs the user out via the SSR-aware browser client and redirects to /login.
 * router.refresh() forces Next.js to re-run the middleware so that server
 * components see the cleared session immediately.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

export function LogoutButton() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient())
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
