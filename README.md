# Tanzai Web App V12

Production-ready Tanzai frontend connected to backend API.

## Added in V12
- Admin Dashboard
- Local analytics/event tracking
- User/message/error/response-time cards
- Recent activity table
- Admin route button
- Revenue placeholder for future subscription
- Previous V11 memory/custom instructions retained
- Email, Google, Apple, Microsoft login buttons through Supabase
- Voice input base
- Dark/Light mode
- GA4 tag included
- Google Cloud Run Dockerfile

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Required env
```env
VITE_SYLERI_ENGINE_URL=https://engine.syleri.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAILS=owner@example.com,admin@example.com
```

If `VITE_ADMIN_EMAILS` is empty, admin dashboard is visible for testing.

## Deploy to Google Cloud Run
```bash
gcloud run deploy tanzai-web-app --source . --region asia-south1 --allow-unauthenticated
```

## Backend expected payload
POST /chat
```json
{
  "message": "hello",
  "userId": "user-id",
  "memory": [],
  "customInstructions": "answer in Hindi"
}
```

## Production analytics next step
Current V12 stores recent activity in browser localStorage. For real production, create a Supabase `analytics_events` table or add backend analytics endpoint:

```txt
POST /analytics/event
GET /admin/metrics
```
