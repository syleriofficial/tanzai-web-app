import { type EngineChatMessage } from '@/types/chat'

const DEFAULT_ENGINE_URL = 'https://engine.syleri.com'
const DEFAULT_TIMEOUT_MS = 30000

type SyleriResponse = {
  answer?: string
  content?: string
  message?: string
  error?: string
}

export async function completeWithSyleri(messages: EngineChatMessage[]) {
  const engineUrl = process.env.SYLERI_ENGINE_URL || DEFAULT_ENGINE_URL
  const syleriKey = process.env.SYLERI_API_KEY

  if (!syleriKey) {
    throw new Error('SYLERI_API_KEY is not configured.')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${engineUrl}/v1/chat/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-syleri-key': syleriKey,
      },
      body: JSON.stringify({
        messages,
        profile: 'balanced',
      }),
      cache: 'no-store',
      signal: controller.signal,
    })

    const data = (await response.json().catch(() => null)) as SyleriResponse | null

    if (!response.ok) {
      throw new Error(data?.error || 'Syleri Engine is temporarily unavailable.')
    }

    return (
      data?.answer ||
      data?.content ||
      data?.message ||
      'Tanzai could not generate a response right now.'
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Syleri Engine timed out. Please try again.')
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}
