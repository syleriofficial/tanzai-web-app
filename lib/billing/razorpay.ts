const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

export async function createRazorpaySubscription(params: {
  planId: string
  userId: string
  plan: string
  interval: string
  region?: string
  country?: string | null
}) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured.')
  }

  const totalCount = params.interval === 'yearly' ? 10 : 120
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

  const response = await fetch(`${RAZORPAY_API_BASE}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: params.planId,
      total_count: totalCount,
      quantity: 1,
      customer_notify: 1,
      notes: {
        user_id: params.userId,
        plan: params.plan,
        interval: params.interval,
        region: params.region || 'developed',
        country: params.country || 'unknown',
      },
    }),
    cache: 'no-store',
  })

  const data = (await response.json().catch(() => null)) as {
    id?: string
    error?: { description?: string }
  } | null

  if (!response.ok || !data?.id) {
    throw new Error(data?.error?.description || 'Unable to create Razorpay subscription.')
  }

  return {
    keyId,
    subscriptionId: data.id,
  }
}
