import { z } from "zod"
import { tool } from "ai"
import type { AIModel } from "@ai-sdk/openai"

// Define the state schema for our graph
const StateSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "tool"]),
      content: z.string(),
      name: z.string().optional(),
    }),
  ),
  currentStep: z.enum(["initial", "gathering_info", "searching", "providing_results"]),
  truckInfo: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),
    partType: z.string().optional(),
  }),
  searchResults: z
    .array(
      z.object({
        partNumber: z.string(),
        description: z.string(),
        price: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
})

type State = z.infer<typeof StateSchema>

// Create a simple LangGraph implementation
export function createGraph() {
  // Initial state
  const initialState: State = {
    messages: [],
    currentStep: "initial",
    truckInfo: {},
    searchResults: [],
  }

  // Define the graph's nodes and edges
  return {
    processMessages: async (agent: any, messages: any[]) => {
      let state = { ...initialState, messages }

      // Process the conversation through the graph
      state = await determineStep(state)

      if (state.currentStep === "gathering_info") {
        state = await gatherTruckInfo(state, agent)
      }

      if (state.currentStep === "searching") {
        state = await searchParts(state)
      }

      if (state.currentStep === "providing_results") {
        state = await formatResults(state)
      }

      return state.messages
    },
  }
}

// Helper functions for the graph nodes
async function determineStep(state: State): Promise<State> {
  const lastMessage = state.messages[state.messages.length - 1]

  if (lastMessage.role !== "user") {
    return state
  }

  // Check if we have all the required truck info
  const { make, model, year, partType } = state.truckInfo

  if (!make || !model || !year || !partType) {
    return { ...state, currentStep: "gathering_info" }
  }

  return { ...state, currentStep: "searching" }
}

async function gatherTruckInfo(state: State, agent: any): Promise<State> {
  // Extract truck information from the conversation
  const userMessages = state.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ")

  // Use the agent to extract structured information
  const extractedInfo = await extractTruckInfo(agent, userMessages)

  return {
    ...state,
    truckInfo: {
      ...state.truckInfo,
      ...extractedInfo,
    },
    currentStep:
      extractedInfo.make && extractedInfo.model && extractedInfo.year && extractedInfo.partType
        ? "searching"
        : "gathering_info",
  }
}

async function searchParts(state: State): Promise<State> {
  // In a real implementation, this would call an API or scrape the Intella Parts website
  // For this example, we'll simulate finding parts
  const { make, model, year, partType } = state.truckInfo

  // Simulate search results
  const mockResults = [
    {
      partNumber: `IP-${make?.substring(0, 3).toUpperCase()}-${year?.substring(2)}-${Math.floor(Math.random() * 10000)}`,
      description: `${partType} for ${year} ${make} ${model}`,
      price: `$${Math.floor(Math.random() * 500) + 50}.99`,
      url: `https://www.intellaparts.com/product/${make}-${model}-${partType}`.toLowerCase(),
    },
    {
      partNumber: `IP-${make?.substring(0, 3).toUpperCase()}-${year?.substring(2)}-${Math.floor(Math.random() * 10000)}`,
      description: `Premium ${partType} for ${year} ${make} ${model}`,
      price: `$${Math.floor(Math.random() * 700) + 100}.99`,
      url: `https://www.intellaparts.com/product/premium-${make}-${model}-${partType}`.toLowerCase(),
    },
  ]

  return {
    ...state,
    searchResults: mockResults,
    currentStep: "providing_results",
  }
}

async function formatResults(state: State): Promise<State> {
  // Format the search results as a message
  const { searchResults, truckInfo } = state

  if (!searchResults || searchResults.length === 0) {
    const noResultsMessage = {
      role: "assistant" as const,
      content: `I couldn't find any ${truckInfo.partType} for your ${truckInfo.year} ${truckInfo.make} ${truckInfo.model}. Could you provide more details or try a different part?`,
    }

    return {
      ...state,
      messages: [...state.messages, noResultsMessage],
      currentStep: "gathering_info",
    }
  }

  const resultsText = searchResults
    .map(
      (result) =>
        `Part Number: ${result.partNumber}
Description: ${result.description}
Price: ${result.price}
More info: ${result.url}`,
    )
    .join("\n\n")

  const resultsMessage = {
    role: "assistant" as const,
    content: `I found the following ${truckInfo.partType} options for your ${truckInfo.year} ${truckInfo.make} ${truckInfo.model}:\n\n${resultsText}\n\nWould you like more information about any of these parts?`,
  }

  return {
    ...state,
    messages: [...state.messages, resultsMessage],
    currentStep: "initial",
  }
}

// Helper function to extract truck information using the AI model
async function extractTruckInfo(agent: AIModel, text: string) {
  // In a real implementation, this would use the AI model to extract structured data
  // For this example, we'll use a simple regex-based approach

  const makeRegex = /(ford|chevrolet|chevy|gmc|dodge|ram|toyota|nissan|freightliner|peterbilt|kenworth|volvo|mack)/i
  const makeMatch = text.match(makeRegex)

  const modelRegex =
    /(f-?150|f-?250|f-?350|silverado|sierra|ram ?1500|ram ?2500|tundra|titan|cascadia|579|t680|vnl|anthem)/i
  const modelMatch = text.match(modelRegex)

  const yearRegex = /(20\d{2}|19\d{2})/
  const yearMatch = text.match(yearRegex)

  const partRegex =
    /(brake|caliper|rotor|pad|filter|engine|transmission|clutch|axle|wheel|tire|suspension|steering|radiator|pump|sensor|light|mirror|door|window|seat|belt|pulley|alternator|starter|battery)/i
  const partMatch = text.match(partRegex)

  return {
    make: makeMatch ? makeMatch[0].toLowerCase() : undefined,
    model: modelMatch ? modelMatch[0].toLowerCase() : undefined,
    year: yearMatch ? yearMatch[0] : undefined,
    partType: partMatch ? partMatch[0].toLowerCase() : undefined,
  }
}

// Create an agent that can use tools
export function createAgent(model: AIModel) {
  return {
    model,
    tools: {
      searchIntellaPartsCatalog: tool({
        description: "Search the Intella Parts catalog for truck parts",
        parameters: z.object({
          make: z.string().describe("The make of the truck"),
          model: z.string().describe("The model of the truck"),
          year: z.string().describe("The year of the truck"),
          partType: z.string().describe("The type of part needed"),
        }),
        execute: async ({ make, model, year, partType }) => {
          // In a real implementation, this would search the Intella Parts website
          // For this example, we'll return mock data
          return [
            {
              partNumber: `IP-${make.substring(0, 3).toUpperCase()}-${year.substring(2)}-${Math.floor(Math.random() * 10000)}`,
              description: `${partType} for ${year} ${make} ${model}`,
              price: `$${Math.floor(Math.random() * 500) + 50}.99`,
            },
            {
              partNumber: `IP-${make.substring(0, 3).toUpperCase()}-${year.substring(2)}-${Math.floor(Math.random() * 10000)}`,
              description: `Premium ${partType} for ${year} ${make} ${model}`,
              price: `$${Math.floor(Math.random() * 700) + 100}.99`,
            },
          ]
        },
      }),
    },
  }
}
