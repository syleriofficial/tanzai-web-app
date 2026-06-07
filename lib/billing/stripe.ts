const STRIPE_API_BASE = 'https://api.stripe.com/v1'

export async function createCheckoutSession(params: {
  customerEmail?: string
  priceId: string
  userId: string
  plan: string
  interval: string
  successUrl: string
  cancelUrl: string
}) {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured.')
  }

  const body = new URLSearchParams({
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    'line_items[0][price]': params.priceId,
    'line_items[0][quantity]': '1',
    'metadata[user_id]': params.userId,
    'metadata[plan]': params.plan,
    'metadata[interval]': params.interval,
    'subscription_data[metadata][user_id]': params.userId,
    'subscription_data[metadata][plan]': params.plan,
    'subscription_data[metadata][interval]': params.interval,
    allow_promotion_codes: 'true',
    billing_address_collection: 'auto',
  })

  if (params.customerEmail) {
    body.set('customer_email', params.customerEmail)
  }

  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const data = (await response.json().catch(() => null)) as {
    url?: string
    error?: { message?: string }
  } | null

  if (!response.ok || !data?.url) {
    throw new Error(data?.error?.message || 'Unable to create Stripe Checkout session.')
  }

  return data.url
}
