// Configuration for different API endpoints and authentication methods
export interface APIConfig {
  baseUrl: string
  apiKey?: string
  authMethod: "bearer" | "api-key" | "basic" | "none"
  endpoints: {
    search: string
    partDetails: string
    compatibility: string
    categories: string
  }
}

// Default configuration - update these based on Intella Parts API documentation
export const defaultConfig: APIConfig = {
  baseUrl: process.env.INTELLA_PARTS_API_URL || "https://api.intellaparts.com",
  apiKey: process.env.INTELLA_PARTS_API_KEY,
  authMethod: "bearer", // Change this based on their auth method
  endpoints: {
    search: "/api/v1/parts/search",
    partDetails: "/api/v1/parts",
    compatibility: "/api/v1/parts/{partNumber}/compatibility",
    categories: "/api/v1/categories",
  },
}

// Alternative configurations for different API structures
export const alternativeConfigs = {
  // If they use REST with different structure
  restful: {
    ...defaultConfig,
    endpoints: {
      search: "/parts",
      partDetails: "/parts/{partNumber}",
      compatibility: "/parts/{partNumber}/vehicles",
      categories: "/categories/{category}/parts",
    },
  },

  // If they use GraphQL
  graphql: {
    ...defaultConfig,
    endpoints: {
      search: "/graphql",
      partDetails: "/graphql",
      compatibility: "/graphql",
      categories: "/graphql",
    },
  },
}
