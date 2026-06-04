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
    const messages = body?.messages || []

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const engineUrl = process.env.SYLERI_ENGINE_URL

    if (!engineUrl) {
      return NextResponse.json({
        answer:
          'Tanzai engine is not configured yet. Please add SYLERI_ENGINE_URL in Cloud Run environment variables.',
      })
    }

    const response = await fetch(`${engineUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.SYLERI_API_KEY
          ? { Authorization: `Bearer ${process.env.SYLERI_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        message,
        messages: messages as ChatMessage[],
        app: 'tanzai',
      }),
    })

    if (!response.ok) {
      return NextResponse.json({
        answer: 'Tanzai engine is temporarily unavailable. Please try again.',
      })
    }

    const data = await response.json()

    return NextResponse.json({
      answer:
        data.answer ||
        data.reply ||
        data.message ||
        data.content ||
        'Tanzai could not generate a response right now.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        answer: 'Something went wrong while connecting to Tanzai engine.',
      },
      { status: 200 }
    )
  }
}
