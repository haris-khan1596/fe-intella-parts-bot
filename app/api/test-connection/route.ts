import { NextResponse } from "next/server"
import { intellaPartsAPI } from "@/lib/intella-parts-api"

export async function GET() {
  try {
    console.log("Testing Intella Parts API connection...")
    console.log("API URL:", process.env.INTELLA_PARTS_API_URL)
    console.log("API Key configured:", !!process.env.INTELLA_PARTS_API_KEY)

    // Test the API connection with a simple search
    const testResult = await intellaPartsAPI.searchParts({
      keyword: "brake",
      limit: 1,
    })

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Intella Parts API",
      apiUrl: process.env.INTELLA_PARTS_API_URL,
      hasApiKey: !!process.env.INTELLA_PARTS_API_KEY,
      sampleResult: testResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API Connection Test Failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Intella Parts API",
        apiUrl: process.env.INTELLA_PARTS_API_URL,
        hasApiKey: !!process.env.INTELLA_PARTS_API_KEY,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
