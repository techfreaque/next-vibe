export const translations = {
  errors: {
    missingUrlParam:
      "Missing URL parameter {{paramName}} for endpoint {{endpoint}}",
    urlConstructionFailed: "URL construction failed: {{error}}",
    validationFailed: "Validation failed: {{error}}",
    htmlResponseReceived:
      "HTML response received instead of JSON from {{url}} (status {{status}}). Check that the API server is running and the endpoint exists.",
    networkError: "Network error occurred: {{error}}",
    failedToLoadPage: "Failed to load page",
  },
  generate: {
    post: {
      title: "Generate Expo Indexes",
      titleShort: "Expo Indexes",
      description:
        "Generate Expo Router compatibility wrappers for Next.js pages",
      response: {
        fields: {
          success: "Success",
          created: "Created Files",
          skipped: "Skipped Files",
          errors: "Errors",
          message: "Message",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You are not authorized to perform this action",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while generating indexes",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to perform this action",
        },
        notFound: {
          title: "Not Found",
          description: "Source directory not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
      success: {
        title: "Success",
        description:
          "Generated {{created}} files, skipped {{skipped}} files, {{errors}} errors",
      },
    },
  },
};
