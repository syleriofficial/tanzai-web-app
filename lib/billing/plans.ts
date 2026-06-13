export type BillingPlan = 'pro' | 'team'
export type BillingInterval = 'monthly' | 'yearly'
export type BillingRegion = 'developing' | 'developed'

type PriceEnv = {
  monthly: string | undefined
  yearly: string | undefined
}

type RegionalPriceEnv = Record<BillingRegion, PriceEnv>

export const billingPlans: Record<BillingPlan, RegionalPriceEnv> = {
  pro: {
    developed: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
    developing: {
      monthly:
        process.env.STRIPE_PRO_DEVELOPING_MONTHLY_PRICE_ID ||
        process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      yearly:
        process.env.STRIPE_PRO_DEVELOPING_YEARLY_PRICE_ID ||
        process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
  },
  team: {
    developed: {
      monthly: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
    },
    developing: {
      monthly:
        process.env.STRIPE_TEAM_DEVELOPING_MONTHLY_PRICE_ID ||
        process.env.STRIPE_TEAM_MONTHLY_PRICE_ID,
      yearly:
        process.env.STRIPE_TEAM_DEVELOPING_YEARLY_PRICE_ID ||
        process.env.STRIPE_TEAM_YEARLY_PRICE_ID,
    },
  },
}

export const razorpayPlans: Record<BillingPlan, RegionalPriceEnv> = {
  pro: {
    developed: {
      monthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID,
      yearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID,
    },
    developing: {
      monthly:
        process.env.RAZORPAY_PRO_DEVELOPING_MONTHLY_PLAN_ID ||
        process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID,
      yearly:
        process.env.RAZORPAY_PRO_DEVELOPING_YEARLY_PLAN_ID ||
        process.env.RAZORPAY_PRO_YEARLY_PLAN_ID,
    },
  },
  team: {
    developed: {
      monthly: process.env.RAZORPAY_TEAM_MONTHLY_PLAN_ID,
      yearly: process.env.RAZORPAY_TEAM_YEARLY_PLAN_ID,
    },
    developing: {
      monthly:
        process.env.RAZORPAY_TEAM_DEVELOPING_MONTHLY_PLAN_ID ||
        process.env.RAZORPAY_TEAM_MONTHLY_PLAN_ID,
      yearly:
        process.env.RAZORPAY_TEAM_DEVELOPING_YEARLY_PLAN_ID ||
        process.env.RAZORPAY_TEAM_YEARLY_PLAN_ID,
    },
  },
}

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === 'pro' || value === 'team'
}

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === 'monthly' || value === 'yearly'
}

export function getStripePriceId(
  plan: BillingPlan,
  interval: BillingInterval,
  region: BillingRegion = 'developed'
) {
  return billingPlans[plan][region][interval]
}

export function getRazorpayPlanId(
  plan: BillingPlan,
  interval: BillingInterval,
  region: BillingRegion = 'developed'
) {
  return razorpayPlans[plan][region][interval]
}
