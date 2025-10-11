export const basicStreamTranslations = {
  error: {
    validation: {
      title: "Basic Stream Validation Error",
      description: "Please check your streaming parameters and try again",
    },
    network: {
      title: "Basic Stream Network Error",
      description: "Failed to connect to the streaming service",
    },
    unauthorized: {
      title: "Basic Stream Unauthorized",
      description: "You don't have permission to access basic streaming",
    },
    server: {
      title: "Basic Stream Server Error",
      description: "An error occurred while processing your stream request",
    },
    unknown: {
      title: "Basic Stream Unknown Error",
      description: "An unexpected error occurred during streaming",
    },
    initialization: "Failed to initialize streaming connection",
    processing: "Failed to process streaming request",
    noReader: "No response body reader available",
    httpStatus: {
      "400": "Bad request",
      "401": "Unauthorized",
      "403": "Forbidden",
      "404": "Not found",
      "500": "Internal server error",
    },
  },
  success: {
    title: "Basic Stream Success",
    description: "Basic streaming completed successfully",
  },
};
