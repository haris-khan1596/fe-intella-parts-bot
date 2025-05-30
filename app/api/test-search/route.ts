import { NextResponse } from "next/server"
import { intellaPartsAPI } from "@/lib/intella-parts-api"

export async function POST(req: Request) {
  try {
    const { make, model, year, partType } = await req.json()

    console.log("Testing search with params:", { make, model, year, partType })

    const searchResult = await intellaPartsAPI.searchParts({
      make,
      model,
      year,
      partType,
      limit: 5, // Limit for testing
    })

    return NextResponse.json({
      success: true,
      message: `Found ${searchResult.parts.length} parts`,
      data: {
        searchParams: { make, model, year, partType },
        results: searchResult,
      },
    })
  } catch (error) {
    console.error("Search test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Search test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
