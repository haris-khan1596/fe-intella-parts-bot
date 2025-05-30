import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test connection to LangGraph server
    const testResponse = await fetch(`${process.env.LANGGRAPH_SERVER_URL}/health`, {
      method: "GET",
      headers: {
        ...(process.env.LANGGRAPH_API_KEY && {
          Authorization: `Bearer ${process.env.LANGGRAPH_API_KEY}`,
        }),
      },
    })

    const isHealthy = testResponse.ok

    return NextResponse.json({
      status: isHealthy ? "healthy" : "unhealthy",
      langGraphServer: {
        url: process.env.LANGGRAPH_SERVER_URL,
        connected: isHealthy,
        status: testResponse.status,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        langGraphServer: {
          url: process.env.LANGGRAPH_SERVER_URL,
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
