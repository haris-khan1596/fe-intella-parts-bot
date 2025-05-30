import { NextResponse } from "next/server"
import { intellaPartsAPI } from "@/lib/intella-parts-api"

export async function POST(req: Request) {
  try {
    const { partNumber } = await req.json()

    console.log("Testing part details for:", partNumber)

    const partDetails = await intellaPartsAPI.getPartDetails(partNumber)

    if (!partDetails) {
      return NextResponse.json({
        success: false,
        message: `Part number ${partNumber} not found`,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Found details for part ${partNumber}`,
      data: {
        partNumber,
        details: partDetails,
      },
    })
  } catch (error) {
    console.error("Part details test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Part details test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
