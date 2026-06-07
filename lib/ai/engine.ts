import { type EngineChatMessage } from '@/types/chat'

const DEFAULT_TIMEOUT_MS = 30000

type EngineResponse = {
  answer?: string
  content?: string
  message?: string
  error?: string
}

function getEngineConfig() {
  const engineUrl =
    process.env.NEXT_PUBLIC_ENGINE_URL ||
    process.env.ENGINE_URL ||
    process.env.SYLERI_ENGINE_URL
  const engineKey = process.env.ENGINE_API_KEY || process.env.SYLERI_API_KEY
  const chatPath = process.env.ENGINE_CHAT_PATH || '/v1/chat/complete'

  if (!engineUrl) {
    throw new Error('Engine URL is not configured.')
  }

  if (!engineKey) {
    throw new Error('Engine API key is not configured.')
  }

  return {
    chatPath,
    engineKey,
    engineUrl: engineUrl.replace(/\/$/, ''),
  }
}

export async function completeWithEngine(messages: EngineChatMessage[]) {
  const { chatPath, engineKey, engineUrl } = getEngineConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${engineUrl}${chatPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${engineKey}`,
        'Content-Type': 'application/json',
        'x-api-key': engineKey,
        'x-engine-key': engineKey,
        'x-syleri-key': engineKey,
      },
      body: JSON.stringify({
        messages,
        profile: 'balanced',
      }),
      cache: 'no-store',
      signal: controller.signal,
    })

    const data = (await response.json().catch(() => null)) as EngineResponse | null

    if (!response.ok) {
      throw new Error(data?.error || 'Tanzai is temporarily unavailable.')
    }

    return (
      data?.answer ||
      data?.content ||
      data?.message ||
      'Tanzai could not generate a response right now.'
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tanzai took too long to respond. Please try again.')
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}
