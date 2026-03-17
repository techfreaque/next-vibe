export const translations = {
  category: "System",
  get: {
    title: "Generate Secret Key",
    description:
      "Generate a cryptographically secure random 64-character hex key",
    tags: {
      generateKey: "Generate Key",
    },
    response: {
      key: {
        title: "Generated Key",
      },
    },
    success: {
      title: "Key Generated",
      description: "Secure key generated successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to generate key",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
};
