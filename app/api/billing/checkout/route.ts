import { NextResponse } from 'next/server'
import {
  getStripePriceId,
  isBillingInterval,
  isBillingPlan,
} from '@/lib/billing/plans'
import { createCheckoutSession } from '@/lib/billing/stripe'
import { createServerClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Please sign in before upgrading.' },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => null)
    const plan = body?.plan
    const interval = body?.interval

    if (!isBillingPlan(plan) || !isBillingInterval(interval)) {
      return NextResponse.json(
        { error: 'Invalid billing plan.' },
        { status: 400 }
      )
    }

    const priceId = getStripePriceId(plan, interval)

    if (!priceId) {
      return NextResponse.json(
        { error: 'This plan is not configured yet.' },
        { status: 500 }
      )
    }

    const origin = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '')
    const checkoutUrl = await createCheckoutSession({
      customerEmail: user.email,
      priceId,
      userId: user.id,
      plan,
      interval,
      successUrl: `${origin}/settings?billing=success`,
      cancelUrl: `${origin}/pricing?billing=cancelled`,
    })

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to start checkout.',
      },
      { status: 500 }
    )
  }
}
