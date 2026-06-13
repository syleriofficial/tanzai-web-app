# Tanzai

Tanzai is a Next.js and Supabase AI chat workspace. The browser talks to the
Next.js app, Supabase handles auth/session cookies and chat history, and the
server-side `/api/chat` route calls the private AI engine.

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
ENGINE_URL=
ENGINE_API_KEY=
ENGINE_CHAT_PATH=/v1/chat/complete
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
ENGINE_URL=
ENGINE_API_KEY=
ENGINE_CHAT_PATH=/v1/chat/complete
STRIPE_SECRET_KEY=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_YEARLY_PRICE_ID=
STRIPE_TEAM_MONTHLY_PRICE_ID=
STRIPE_TEAM_YEARLY_PRICE_ID=
```

Never expose `ENGINE_API_KEY` to the browser. Tanzai always calls the AI engine
from the server-side API route.

Never expose `STRIPE_SECRET_KEY` to the browser. Tanzai creates Stripe Checkout
sessions from the server-side billing route.

## Google OAuth

Supabase Google sign-in requires an active Google OAuth client. If users see
`Error 401: deleted_client`, create a new Google OAuth client in Google Cloud
project `syleri` and paste the new client ID and secret into Supabase
Authentication > Providers > Google.

Authorized JavaScript origins:

```text
https://tanzaiai.com
https://tanzai-web-647343293925.asia-south1.run.app
```

Authorized redirect URI in Google Cloud:

```text
https://fzopbexdrfzxyhetmsrt.supabase.co/auth/v1/callback
```

Supabase Auth URL configuration:

```text
Site URL: https://tanzaiai.com
Redirect URLs:
https://tanzaiai.com/auth/callback
https://tanzai-web-647343293925.asia-south1.run.app/auth/callback
http://localhost:8080/auth/callback
```

## Important Routes

- `/api/chat` - authenticated server route that calls the AI engine and stores chat history
- `/api/billing/checkout` - authenticated server route that starts Stripe Checkout
- `/api/health` - lightweight health check endpoint
- `/auth/callback` - Supabase OAuth callback
- `/chat`, `/profile`, `/settings`, `/admin` - protected app routes

## Supabase Chat History

Run `supabase/chat_history.sql` in the Supabase SQL editor before using chat
history in production. It creates the `chat_history` table and row-level
security policies for authenticated users.
