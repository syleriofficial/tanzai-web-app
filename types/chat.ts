export type ChatRole = 'user' | 'assistant' | 'system'

export type EngineChatMessage = {
  role: ChatRole
  content: string
}

export type ChatApiResponse = {
  answer: string
  success: boolean
  chatId?: string
  title?: string
  error?: string
}
