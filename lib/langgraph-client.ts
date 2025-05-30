interface LangGraphMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

interface LangGraphRequest {
  messages: LangGraphMessage[]
  session_id?: string
  config?: Record<string, any>
}

interface LangGraphResponse {
  message: string
  session_id: string
  metadata?: Record<string, any>
  tool_calls?: Array<{
    tool: string
    args: Record<string, any>
    result: any
  }>
}

export class LangGraphClient {
  private baseUrl: string
  private apiKey?: string

  constructor() {
    this.baseUrl = process.env.LANGGRAPH_SERVER_URL || "http://localhost:8000"
    this.apiKey = process.env.LANGGRAPH_API_KEY
  }

  async sendMessage(messages: LangGraphMessage[], sessionId?: string, config?: Record<string, any>): Promise<Response> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`
      // Alternative auth methods based on your server setup:
      // headers["X-API-Key"] = this.apiKey
    }

    const requestBody: LangGraphRequest = {
      messages,
      session_id: sessionId,
      config,
    }

    console.log("Sending request to LangGraph server:", {
      url: `${this.baseUrl}/chat`,
      body: requestBody,
    })

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LangGraph server error:", errorText)
      throw new Error(`LangGraph server error: ${response.status} - ${errorText}`)
    }

    return response
  }

  async sendMessageStream(
    messages: LangGraphMessage[],
    sessionId?: string,
    config?: Record<string, any>,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    }

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`
    }

    const requestBody: LangGraphRequest = {
      messages,
      session_id: sessionId,
      config,
    }

    console.log("Sending streaming request to LangGraph server:", {
      url: `${this.baseUrl}/chat/stream`,
      body: requestBody,
    })

    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("LangGraph streaming error:", errorText)
      throw new Error(`LangGraph streaming error: ${response.status} - ${errorText}`)
    }

    return response
  }

  // For non-streaming responses
  async getChatResponse(
    messages: LangGraphMessage[],
    sessionId?: string,
    config?: Record<string, any>,
  ): Promise<LangGraphResponse> {
    const response = await this.sendMessage(messages, sessionId, config)
    return await response.json()
  }
}

export const langGraphClient = new LangGraphClient()
