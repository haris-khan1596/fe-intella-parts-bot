import { tool } from "ai"
import { z } from "zod"
import { intellaPartsAPI } from "./intella-parts-api"

export const searchTruckPartsTool = tool({
  description: "Search for truck parts using vehicle information and part type",
  parameters: z.object({
    make: z.string().optional().describe("Truck make (e.g., Ford, Chevrolet, Freightliner)"),
    model: z.string().optional().describe("Truck model (e.g., F-150, Silverado, Cascadia)"),
    year: z.string().optional().describe("Truck year"),
    partType: z.string().optional().describe("Part type (e.g., brake caliper, air filter, headlight)"),
    keyword: z.string().optional().describe("Additional search keywords"),
    limit: z.number().optional().describe("Max results (default: 5)"),
  }),
  execute: async ({ make, model, year, partType, keyword, limit = 5 }) => {
    try {
      const searchResults = await intellaPartsAPI.searchParts({
        make,
        model,
        year,
        partType,
        keyword,
        limit,
      })

      if (searchResults.parts.length === 0) {
        return {
          success: false,
          message: "No parts found. Try different search criteria.",
          parts: [],
        }
      }

      return {
        success: true,
        message: `Found ${searchResults.parts.length} parts`,
        parts: searchResults.parts.map((part) => ({
          partNumber: part.partNumber,
          description: part.description,
          price: part.price ? `$${part.price.toFixed(2)}` : "Contact for price",
          availability: part.availability || "Check availability",
          manufacturer: part.manufacturer || "Various",
        })),
        totalResults: searchResults.totalResults,
      }
    } catch (error) {
      return {
        success: false,
        message: "Error searching for parts. Please try again.",
        parts: [],
      }
    }
  },
})

export const getPartDetailsTool = tool({
  description: "Get detailed information about a specific part using its part number",
  parameters: z.object({
    partNumber: z.string().describe("The part number to get details for"),
  }),
  execute: async ({ partNumber }) => {
    try {
      const part = await intellaPartsAPI.getPartDetails(partNumber)

      if (!part) {
        return {
          success: false,
          message: `Part number ${partNumber} not found`,
        }
      }

      return {
        success: true,
        part: {
          partNumber: part.partNumber,
          description: part.description,
          price: part.price ? `$${part.price.toFixed(2)}` : "Contact for price",
          availability: part.availability || "Check availability",
          manufacturer: part.manufacturer || "Unknown",
          category: part.category || "Unknown",
          specifications: part.specifications || {},
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Error getting part details. Please try again.",
      }
    }
  },
})

export const intellaPartsTools = {
  searchTruckParts: searchTruckPartsTool,
  getPartDetails: getPartDetailsTool,
}
