# Tanzai Web App

Tanzai is the product/web layer for Syleri Engine. The browser talks to the
Next.js app, Supabase handles auth/session cookies, and the server-side
`/api/chat` route calls Syleri Engine with a private API key.

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill the values:

```env
SITE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SYLERI_ENGINE_URL=https://engine.syleri.com
SYLERI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_YEARLY_PRICE_ID=
STRIPE_TEAM_MONTHLY_PRICE_ID=
STRIPE_TEAM_YEARLY_PRICE_ID=
```

## Production Checks

```bash
npm run build
npm run start
```

The production server listens on port `8080`, which is ready for Google Cloud
Run.

## Google Cloud Run

Set these environment variables on the Cloud Run service:

```env
SITE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SYLERI_ENGINE_URL=https://engine.syleri.com
SYLERI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_YEARLY_PRICE_ID=
STRIPE_TEAM_MONTHLY_PRICE_ID=
STRIPE_TEAM_YEARLY_PRICE_ID=
```

Never expose `SYLERI_API_KEY` to the browser. Tanzai always calls Syleri Engine
from the server-side API route.

Never expose `STRIPE_SECRET_KEY` to the browser. Tanzai creates Stripe Checkout
sessions from the server-side billing route.

## Important Routes

- `/api/chat` - authenticated server route that calls Syleri Engine
- `/api/billing/checkout` - authenticated server route that starts Stripe Checkout
- `/api/health` - lightweight health check endpoint
- `/auth/callback` - Supabase OAuth callback
- `/chat`, `/profile`, `/settings`, `/admin` - protected app routes
