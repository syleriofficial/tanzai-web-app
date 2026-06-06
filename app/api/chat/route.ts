import { NextResponse } from 'next/server'
import { completeWithSyleri } from '@/lib/ai/syleri'
import { checkRateLimit } from '@/lib/rate-limit'
import { createServerClient } from '@/lib/supabase'
import { type ChatApiResponse, type EngineChatMessage } from '@/types/chat'

export const runtime = 'nodejs'

const CHAT_RATE_LIMIT = 30
const CHAT_RATE_WINDOW_MS = 60 * 1000

function json(body: ChatApiResponse, status = 200) {
  return NextResponse.json(body, { status })
}

function normalizeMessages(body: unknown): EngineChatMessage[] {
  if (!body || typeof body !== 'object') return []

  const payload = body as {
    message?: unknown
    messages?: unknown
  }

  if (Array.isArray(payload.messages)) {
    return payload.messages
      .filter((message): message is EngineChatMessage => {
        if (!message || typeof message !== 'object') return false

        const item = message as Partial<EngineChatMessage>

        return (
          (item.role === 'user' || item.role === 'assistant' || item.role === 'system') &&
          typeof item.content === 'string' &&
          item.content.trim().length > 0
        )
      })
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }))
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return [
      {
        role: 'user',
        content: payload.message.trim(),
      },
    ]
  }

  return []
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return json(
        {
          answer: 'Please sign in to use Tanzai.',
          success: false,
          error: 'unauthorized',
        },
        401
      )
    }

    const rateLimit = checkRateLimit(
      `chat:${user.id}`,
      CHAT_RATE_LIMIT,
      CHAT_RATE_WINDOW_MS
    )

    if (!rateLimit.allowed) {
      return json(
        {
          answer: 'Too many messages. Please wait a moment and try again.',
          success: false,
          error: 'rate_limited',
        },
        429
      )
    }

    const body = await req.json().catch(() => null)
    const messages = normalizeMessages(body)

    if (messages.length === 0) {
      return json(
        {
          answer: 'Message is required.',
          success: false,
          error: 'missing_message',
        },
        400
      )
    }

    const answer = await completeWithSyleri(messages)

    return json({
      answer,
      success: true,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong while connecting to Syleri Engine.'

    return json(
      {
        answer: message,
        success: false,
        error: 'engine_error',
      },
      502
    )
  }
}
