import { z } from "zod"

export const PartSchema = z.object({
  partNumber: z.string(),
  description: z.string(),
  price: z.number().optional(),
  availability: z.string().optional(),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  imageUrl: z.string().optional(),
  specifications: z.record(z.string()).optional(),
})

export const SearchResponseSchema = z.object({
  parts: z.array(PartSchema),
  totalResults: z.number(),
  page: z.number().optional(),
  hasMore: z.boolean().optional(),
})

export type Part = z.infer<typeof PartSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>

export class IntellaPartsAPI {
  private baseUrl: string
  private apiKey?: string

  constructor() {
    this.baseUrl = process.env.INTELLA_PARTS_API_URL || "https://api.intellaparts.com"
    this.apiKey = process.env.INTELLA_PARTS_API_KEY
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(endpoint, this.baseUrl)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return await response.json()
  }

  async searchParts(params: {
    make?: string
    model?: string
    year?: string
    partType?: string
    partNumber?: string
    keyword?: string
    page?: number
    limit?: number
  }): Promise<SearchResponse> {
    const response = await this.makeRequest("/search/parts", {
      make: params.make,
      model: params.model,
      year: params.year,
      category: params.partType,
      part_number: params.partNumber,
      q: params.keyword,
      page: params.page || 1,
      limit: params.limit || 20,
    })

    return SearchResponseSchema.parse(response)
  }

  async getPartDetails(partNumber: string): Promise<Part | null> {
    try {
      const response = await this.makeRequest(`/parts/${partNumber}`)
      return PartSchema.parse(response)
    } catch (error) {
      return null
    }
  }
}

export const intellaPartsAPI = new IntellaPartsAPI()
