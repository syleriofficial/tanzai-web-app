import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const engineUrl = process.env.NEXT_PUBLIC_SYLERI_ENGINE_URL || 'https://engine.syleri.com'
  const secret = process.env.SYLERI_ENGINE_SECRET

  const endpoint = `${engineUrl.replace(/\/$/, '')}/api/chat`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'x-engine-secret': secret } : {}),
    },
    body: JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') || 'application/json'

  if (contentType.includes('text/event-stream') && response.body) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    })
  }

  const text = await response.text()
  return new Response(text, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  })
}
