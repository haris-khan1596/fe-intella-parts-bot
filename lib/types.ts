// Types for LangGraph integration
export interface LangGraphConfig {
  serverUrl: string
  apiKey?: string
  timeout?: number
  retries?: number
}

export interface ChatSession {
  sessionId: string
  createdAt: string
  lastActivity: string
  messageCount: number
}

export interface LangGraphMetadata {
  sessionId: string
  nodeExecutions?: Array<{
    node: string
    duration: number
    status: "success" | "error"
  }>
  toolCalls?: Array<{
    tool: string
    args: Record<string, any>
    result: any
    duration: number
  }>
}

// Error types
export class LangGraphError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public serverResponse?: any,
  ) {
    super(message)
    this.name = "LangGraphError"
  }
}
