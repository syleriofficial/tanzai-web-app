import { NextResponse } from 'next/server'
import {
  getRazorpayPlanId,
  getStripePriceId,
  isBillingInterval,
  isBillingPlan,
} from '@/lib/billing/plans'
import { createRazorpaySubscription } from '@/lib/billing/razorpay'
import { getBillingRegionForCountry, getCountryFromHeaders } from '@/lib/billing/regions'
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
    const provider = body?.provider === 'razorpay' ? 'razorpay' : 'stripe'

    if (!isBillingPlan(plan) || !isBillingInterval(interval)) {
      return NextResponse.json(
        { error: 'Invalid billing plan.' },
        { status: 400 }
      )
    }

    const country = getCountryFromHeaders(req.headers)
    const region = getBillingRegionForCountry(country)
    const origin = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '')

    if (provider === 'razorpay') {
      const razorpayPlanId = getRazorpayPlanId(plan, interval, region)

      if (!razorpayPlanId) {
        return NextResponse.json(
          { error: 'Razorpay plan is not configured yet.' },
          { status: 500 }
        )
      }

      const subscription = await createRazorpaySubscription({
        planId: razorpayPlanId,
        userId: user.id,
        plan,
        interval,
        region,
        country,
      })

      return NextResponse.json({
        provider: 'razorpay',
        keyId: subscription.keyId,
        subscriptionId: subscription.subscriptionId,
        name: 'Tanzai',
        description: `${plan} ${interval} subscription`,
        email: user.email,
        successUrl: `${origin}/settings?billing=success&provider=razorpay`,
      })
    }

    const priceId = getStripePriceId(plan, interval, region)

    if (!priceId) {
      return NextResponse.json(
        { error: 'This plan is not configured yet.' },
        { status: 500 }
      )
    }

    const checkoutUrl = await createCheckoutSession({
      customerEmail: user.email,
      priceId,
      userId: user.id,
      plan,
      interval,
      region,
      country,
      successUrl: `${origin}/settings?billing=success`,
      cancelUrl: `${origin}/pricing?billing=cancelled`,
    })

    return NextResponse.json({ provider: 'stripe', url: checkoutUrl })
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
