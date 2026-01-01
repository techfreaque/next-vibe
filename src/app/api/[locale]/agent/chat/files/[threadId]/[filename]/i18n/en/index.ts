export const translations = {
  get: {
    title: "Get File",
    description: "Retrieve an uploaded file",
    success: {
      title: "File Retrieved",
      description: "File retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid file request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to retrieve file due to network error",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access this file",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this file",
      },
      notFound: {
        title: "File Not Found",
        description: "The requested file was not found or access was denied",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve file due to server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
  errors: {
    fileNotFound: "File not found or access denied",
  },
};
