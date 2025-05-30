import { langGraphClient } from "@/lib/langgraph-client"
import type { NextRequest } from "next/server"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get session ID from headers or generate one
    const sessionId =
      req.headers.get("x-session-id") || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Convert AI SDK message format to LangGraph format
    const langGraphMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date().toISOString(),
    }))

    console.log("Forwarding to LangGraph server:", {
      sessionId,
      messageCount: langGraphMessages.length,
    })

    // Get streaming response from LangGraph server
    const response = await langGraphClient.sendMessageStream(langGraphMessages, sessionId, {
      truck_parts_mode: true,
      intella_parts_integration: true,
    })

    // Create a readable stream to forward the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // Forward the chunk from LangGraph server
            controller.enqueue(value)
          }
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    // Return streaming response with proper headers
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Session-ID": sessionId,
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Return error response in streaming format
    const errorStream = new ReadableStream({
      start(controller) {
        const errorMessage = `data: ${JSON.stringify({
          type: "error",
          content: error instanceof Error ? error.message : "An error occurred while processing your request.",
        })}\n\n`

        controller.enqueue(new TextEncoder().encode(errorMessage))
        controller.close()
      },
    })

    return new Response(errorStream, {
      status: 500,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    })
  }
}
