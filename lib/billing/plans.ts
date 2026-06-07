export type BillingPlan = 'pro' | 'team'
export type BillingInterval = 'monthly' | 'yearly'

type PriceEnv = {
  monthly: string | undefined
  yearly: string | undefined
}

export const billingPlans: Record<BillingPlan, PriceEnv> = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  },
  team: {
    monthly: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
  },
}

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === 'pro' || value === 'team'
}

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === 'monthly' || value === 'yearly'
}

export function getStripePriceId(plan: BillingPlan, interval: BillingInterval) {
  return billingPlans[plan][interval]
}
