export class IntellaPartsError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error,
  ) {
    super(message)
    this.name = "IntellaPartsError"
  }
}

export function handleAPIError(error: any): IntellaPartsError {
  if (error instanceof IntellaPartsError) {
    return error
  }

  if (error.response) {
    // HTTP error response
    const statusCode = error.response.status
    const message = error.response.data?.message || error.response.statusText || "API request failed"

    switch (statusCode) {
      case 401:
        return new IntellaPartsError("Authentication failed. Please check your API key.", statusCode, error)
      case 403:
        return new IntellaPartsError(
          "Access forbidden. You may not have permission to access this resource.",
          statusCode,
          error,
        )
      case 404:
        return new IntellaPartsError("Resource not found.", statusCode, error)
      case 429:
        return new IntellaPartsError("Rate limit exceeded. Please try again later.", statusCode, error)
      case 500:
        return new IntellaPartsError("Internal server error. Please try again later.", statusCode, error)
      default:
        return new IntellaPartsError(message, statusCode, error)
    }
  }

  if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
    return new IntellaPartsError(
      "Unable to connect to Intella Parts API. Please check your internet connection.",
      undefined,
      error,
    )
  }

  return new IntellaPartsError(error.message || "An unexpected error occurred", undefined, error)
}
