import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const message = body?.message
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : []

    const userMessage =
      typeof message === 'string'
        ? message.trim()
        : messages[messages.length - 1]?.content?.trim()

    if (!userMessage) {
      return NextResponse.json(
        { answer: 'Message is required.' },
        { status: 400 }
      )
    }

    const engineUrl =
      process.env.SYLERI_ENGINE_URL || 'https://engine.syleri.com'

    const syleriKey = process.env.SYLERI_API_KEY

    if (!syleriKey) {
      return NextResponse.json(
        {
          answer:
            'Tanzai engine key is not configured. Please add SYLERI_API_KEY in environment variables.',
        },
        { status: 500 }
      )
    }

    const finalMessages: ChatMessage[] =
      messages.length > 0
        ? messages
        : [
            {
              role: 'user',
              content: userMessage,
            },
          ]

    const response = await fetch(`${engineUrl}/v1/chat/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-syleri-key': syleriKey,
      },
      body: JSON.stringify({
        messages: finalMessages,
        profile: 'balanced',
      }),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          answer:
            data?.error ||
            'Tanzai engine is temporarily unavailable. Please try again.',
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      answer:
        data?.answer ||
        data?.content ||
        data?.message ||
        'Tanzai could not generate a response right now.',
      success: true,
    })
  } catch {
    return NextResponse.json(
      {
        answer: 'Something went wrong while connecting to Tanzai engine.',
      },
      { status: 200 }
    )
  }
}
